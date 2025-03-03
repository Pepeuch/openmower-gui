import { Button, ButtonProps } from "antd";
import React, { useState } from "react";

interface AsyncButtonProps extends ButtonProps {
  onAsyncClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => Promise<void>;
}

const AsyncButton: React.FC<AsyncButtonProps> = ({ onAsyncClick, onChange, children, ...rest }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (onChange) {
      onChange(event);
    }
    if (onAsyncClick) {
      setLoading(true);
      try {
        await onAsyncClick(event);
      } catch (error) {
        console.error("Error in AsyncButton:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Button loading={loading} onClick={handleClick} {...rest}>
      {children}
    </Button>
  );
};

export default AsyncButton;
