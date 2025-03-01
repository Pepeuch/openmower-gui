import React, { useState } from "react";
import { Switch } from "antd";
import type { SwitchProps } from "antd/es/switch";  // ✅ Import correct du type SwitchProps

export const AsyncSwitch: React.FC<SwitchProps & {
    onAsyncChange?: (checked: boolean, event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => Promise<void>;
}> = (props) => {
    const { onAsyncChange, ...rest } = props;
    const [loading, setLoading] = useState(false);

    // ✅ Correction : Ajout de types explicites
    const handleChange: (checked: boolean, event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => void = async (checked, event) => {
        if (props.onChange) {
            props.onChange(checked, event);
        } else if (onAsyncChange) {
            setLoading(true);
            try {
                await onAsyncChange(checked, event);
            } finally {
                setLoading(false);
            }
        }
    };

    return <Switch loading={loading} onChange={handleChange} {...rest} />;
};

export default AsyncSwitch;
