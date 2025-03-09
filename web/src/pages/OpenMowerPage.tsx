import { MowerActions } from "../components/MowerActions.tsx";
import { StatusComponent } from "../components/StatusComponent.tsx";
import { HighLevelStatusComponent } from "../components/HighLevelStatusComponent.tsx";
import { ImuComponent } from "../components/ImuComponent.tsx";
import { WheelTicksComponent } from "../components/WheelTicksComponent.tsx";
import { GpsComponent } from "../components/GpsComponent.tsx";

export const OpenMowerPage = () => {
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">OpenMower</h2>

            <div className="mb-4">
                <MowerActions />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">High Level Status</h3>
                    <HighLevelStatusComponent />
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <StatusComponent />
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">IMU</h3>
                    <ImuComponent />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">GPS</h3>
                        <GpsComponent />
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Wheel Ticks</h3>
                        <WheelTicksComponent />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpenMowerPage;
