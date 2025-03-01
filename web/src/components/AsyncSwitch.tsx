import { Switch, SwitchProps } from "antd";
import * as React from "react";
import type { SwitchChangeEventHandler } from "rc-switch";

export const AsyncSwitch: React.FC<SwitchProps & {
    onAsyncChange: (checked: boolean, event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => Promise<any>;

}> = (props) => {
    const { onAsyncChange, ...rest } = props;
    const [loading, setLoading] = React.useState(false);

    const handleChange: SwitchChangeEventHandler = async (checked, event) => {
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
