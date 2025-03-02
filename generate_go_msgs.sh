#!/bin/bash

set -e  # Arrête le script en cas d'erreur
set -o pipefail  # Capture les erreurs dans les pipes
set -u  # Erreur si une variable non définie est utilisée

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

# Définition des dossiers temporaires
OM_DIR=$(mktemp -d)  # Crée un dossier temporaire
DYN_DIR=$(mktemp -d)

echo "📂 Clonage des dépôts dans :"
echo "   - $OM_DIR"
echo "   - $DYN_DIR"

# Clone les dépôts
git clone --depth=1 https://github.com/ClemensElflein/open_mower_ros "$OM_DIR" || { echo "❌ Failed to clone open_mower_ros"; exit 1; }
git clone --depth=1 https://github.com/ros/dynamic_reconfigure "$DYN_DIR" || { echo "❌ Failed to clone dynamic_reconfigure"; exit 1; }

cd "$OM_DIR" && git submodule update --init --recursive
cd "$SCRIPT_DIR"

# Vérifie si msg-import et srv-import existent
if ! command -v msg-import &> /dev/null || ! command -v srv-import &> /dev/null; then
    echo "❌ The msg-import and srv-import tools are not installed. Install them and add them to your PATH."
    exit 1
fi

# Déclaration des packages
declare -a PACKAGES_NAME=(
    "xbot_msgs" "mower_msgs" "mower_map"
    "xbot_msgs" "mower_msgs" "mower_map"
    "dynamic_reconfigure" "dynamic_reconfigure"
)
declare -a PACKAGES_PATH=(
    "$OM_DIR/src/lib/xbot_msgs/msg" "$OM_DIR/src/mower_msgs/msg" "$OM_DIR/src/mower_map/msg"
    "$OM_DIR/src/lib/xbot_msgs/srv" "$OM_DIR/src/mower_msgs/srv" "$OM_DIR/src/mower_map/srv"
    "$DYN_DIR/srv" "$DYN_DIR/msg"
)

# Boucle sur chaque package
for pkg in "${!PACKAGES_NAME[@]}"; do
    mkdir -p "pkg/msgs/${PACKAGES_NAME[$pkg]}"
    
    # Traitement des fichiers .msg
    for file in $(find "${PACKAGES_PATH[$pkg]}" -name '*.msg' 2>/dev/null); do
        echo "📜 Importation du message : $file"
        filename=$(basename "$file" .msg)
        msg-import --rospackage="${PACKAGES_NAME[$pkg]}" --gopackage="${PACKAGES_NAME[$pkg]}" "$file" > "pkg/msgs/${PACKAGES_NAME[$pkg]}/${filename}.go"
    done

    # Traitement des fichiers .srv
    for file in $(find "${PACKAGES_PATH[$pkg]}" -name '*.srv' 2>/dev/null); do
        echo "🔧 Importation du service : $file"
        filename=$(basename "$file" .srv)
        srv-import --rospackage="${PACKAGES_NAME[$pkg]}" --gopackage="${PACKAGES_NAME[$pkg]}" "$file" > "pkg/msgs/${PACKAGES_NAME[$pkg]}/${filename}.go"
    done
done

# Nettoyage des dossiers temporaires après exécution
rm -rf "$OM_DIR" "$DYN_DIR"

echo "✅ Generation completed successfully !"
