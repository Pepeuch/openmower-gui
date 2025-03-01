package providers

import (
	"bytes"
	"encoding/json"
	"io"
	"os"
	"text/template"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	"github.com/pepeuch/openmower-gui/pkg/types"
	"golang.org/x/sys/execabs"
	"golang.org/x/xerrors"
)

type FirmwareProvider struct {
	db types.IDBProvider
}

func NewFirmwareProvider(db types.IDBProvider) *FirmwareProvider {
	u := &FirmwareProvider{
		db: db,
	}
	return u
}

// BuildBoardHeader Open file ../../setup/board.h, apply go template to it with config and return the result
func (fp *FirmwareProvider) buildBoardHeader(templateFile string, config types.FirmwareConfig) ([]byte, error) {
	if config.BatChargeCutoffVoltage > 29 {
		config.BatChargeCutoffVoltage = 29
	}
	if config.MaxChargeVoltage > 29 {
		config.MaxChargeVoltage = 29
	}
	if config.LimitVoltage150MA > 29 {
		config.LimitVoltage150MA = 29
	}
	if config.MaxChargeCurrent > 1.5 {
		config.MaxChargeCurrent = 1.5
	}
	files, err := template.ParseFiles(templateFile)
	if err != nil {
		return nil, err
	}
	buffer := bytes.NewBuffer(nil)
	err = files.Execute(buffer, config)
	if err != nil {
		return nil, err
	}
	return buffer.Bytes(), nil
}

func (fp *FirmwareProvider) FlashFirmware(writer io.Writer, config types.FirmwareConfig) error {
	if config.Repository == "" && config.File == "" {
		return xerrors.Errorf("repository or file is required")
	}
	if config.Branch == "" && config.Repository != "" {
		return xerrors.Errorf("branch is empty")
	}
	configJson, err := json.Marshal(config)
	if err != nil {
		return err
	}
	err = fp.db.Set("gui.firmware.config", configJson)
	if err != nil {
		return err
	}
	switch config.BoardType {
	case "BOARD_VERMUT_YARDFORCE500":
		return fp.flashVermut(writer, config)
	default:
		return fp.flashMowgli(writer, config)
	}
}

func (fp *FirmwareProvider) flashMowgli(writer io.Writer, config types.FirmwareConfig) error {
	_, _ = writer.Write([]byte("------> Cloning repository " + config.Repository + "@" + config.Branch + "...\n"))
	//Clone git repository, checkout branch, build board.h, build firmware with platformio, flash firmware with platformio
	referenceName := plumbing.ReferenceName("refs/heads/" + config.Branch)
	//Check if repository is already cloned
	_, err := os.Stat(os.TempDir() + "/mowgli")
	if err == nil {
		//Branch is not correct, delete repository
		err = os.RemoveAll(os.TempDir() + "/mowgli")
		if err != nil {
			_, _ = writer.Write([]byte("------> Error while removing repository: " + err.Error() + "\n"))
			return xerrors.Errorf("error while removing repository: %w", err)
		}
	}
	_, err = git.PlainClone(os.TempDir()+"/mowgli", false, &git.CloneOptions{
		URL:           config.Repository,
		SingleBranch:  true,
		ReferenceName: referenceName,
		Progress:      writer,
	})
	if err != nil {
		_, _ = writer.Write([]byte("------> Error while cloning repository: " + err.Error() + "\n"))
		return xerrors.Errorf("error while cloning repository: %w", err)
	}
	_, _ = writer.Write([]byte("------> Repository cloned\n"))
	//Build board.h
	_, _ = writer.Write([]byte("------> Building board.h...\n"))
	boardTemplated, err := fp.buildBoardHeader(os.TempDir()+"/mowgli/stm32/ros_usbnode/include/board.h.template", config)
	if err != nil {
		_, _ = writer.Write([]byte("------> Error while building board.h: " + err.Error() + "\n"))
		return xerrors.Errorf("error while building board.h: %w", err)
	}
	err = os.WriteFile(os.TempDir()+"/mowgli/stm32/ros_usbnode/include/board.h", boardTemplated, 0644)
	if err != nil {
		_, _ = writer.Write([]byte("------> Error while writing board.h: " + err.Error() + "\n"))
		return xerrors.Errorf("error while writing board.h: %w", err)
	}
	_, _ = writer.Write([]byte("------> board.h built\n"))
	//Build firmware
	_, _ = writer.Write([]byte("------> Building and uploading firmware...\n"))
	cmd := execabs.Command("/bin/bash", "-c", "platformio run -t upload")
	cmd.Dir = os.TempDir() + "/mowgli/stm32/ros_usbnode"
	cmd.Stdout = writer
	cmd.Stderr = writer
	err = cmd.Run()
	if err != nil {
		_, _ = writer.Write([]byte("------> Error while building and uploading firmware: " + err.Error() + "\n"))
		return xerrors.Errorf("error while flashing firmware: %w", err)
	}
	_, _ = writer.Write([]byte("------> Firmware flashed\n"))
	return nil
}

func (fp *FirmwareProvider) flashVermut(writer io.Writer, config types.FirmwareConfig) error {
	// Download the firmware from https://github.com/ClemensElflein/OpenMower/releases/download/latest/firmware.zip to /tmp/firmware.zip
	// Unzip /tmp/firmware.zip to /tmp/firmware
	// Flash the firmware by running command openocd -f interface/raspberrypi-swd.cfg -f target/rp2040.cfg -c "program ./firmware_download/firmware/$OM_HARDWARE_VERSION/firmware.elf verify reset exit"

	_, _ = writer.Write([]byte("------> Downloading firmware...\n"))
	cmd := execabs.Command("/bin/bash", "-c", "wget -O "+os.TempDir()+"/firmware.zip "+config.File)
	cmd.Stdout = writer
	cmd.Stderr = writer
	err := cmd.Run()
	if err != nil {
		_, _ = writer.Write([]byte("------> Error while downloading firmware: " + err.Error() + "\n"))
		return xerrors.Errorf("error while downloading firmware: %w", err)
	}
	_, _ = writer.Write([]byte("------> Firmware downloaded\n"))

	_, _ = writer.Write([]byte("------> Unzipping firmware...\n"))
	cmd = execabs.Command("/bin/bash", "-c", "unzip -o "+os.TempDir()+"/firmware.zip -d "+os.TempDir()+"/firmware")
	cmd.Stdout = writer
	cmd.Stderr = writer
	err = cmd.Run()
	if err != nil {
		_, _ = writer.Write([]byte("------> Error while unzipping firmware: " + err.Error() + "\n"))
		return xerrors.Errorf("error while unzipping firmware: %w", err)
	}
	_, _ = writer.Write([]byte("------> Firmware unzipped\n"))

	_, _ = writer.Write([]byte("------> Flashing firmware...\n"))
	cmd = execabs.Command("/bin/bash", "-c", "echo \"10\" > /sys/class/gpio/export && echo \"out\" > /sys/class/gpio/gpio10/direction && echo \"1\" > /sys/class/gpio/gpio10/value && openocd -f interface/raspberrypi-swd.cfg -f target/rp2040.cfg -c \"program "+os.TempDir()+"/firmware/firmware/"+config.Version+"/firmware.elf verify reset exit\"")
	cmd.Stdout = writer
	cmd.Stderr = writer
	err = cmd.Run()
	if err != nil {
		_, _ = writer.Write([]byte("------> Error while flashing firmware: " + err.Error() + "\n"))
		return xerrors.Errorf("error while flashing firmware: %w", err)
	}
	_, _ = writer.Write([]byte("------> Firmware flashed\n"))
	return nil
}
