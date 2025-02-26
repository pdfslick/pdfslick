import { Component, ComponentProps, createSignal, JSX } from 'solid-js';

interface ToggleSwitchProps extends Omit<ComponentProps<'button'>, 'onClick' | 'onChange'> {
  /** Initial enabled state */
  enabled?: boolean;
  /** Callback function when toggle state changes */
  onChange?: (enabled: boolean) => void;
  /** Optional label for the toggle */
  label?: string;
  /** Optional */
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent> | undefined;
}

const ToggleSwitch: Component<ToggleSwitchProps> = (props) => {
  // Split custom props from HTML button props
  const {
    enabled,
    onChange,
    label,
    class: className,
    classList,
    ...buttonProps
  } = props;

  const [isEnabled, setIsEnabled] = createSignal(enabled || false);

  const handleToggle = () => {
    if (props.disabled) return;
    
    const newValue = !isEnabled();
    setIsEnabled(newValue);
    onChange?.(newValue);
  };

  return (
    <button
      type="button"
      {...buttonProps}
      onClick={(e) => {
        handleToggle();
        props.onClick?.(e);
      }}
      class={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full 
        border-2 border-transparent transition-colors duration-200 ease-in-out
        focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isEnabled() ? 'bg-blue-600' : 'bg-gray-200'}
        ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className || ''}
      `}
      classList={{
        ...classList,
      }}
      role="switch"
      aria-checked={isEnabled()}
      aria-disabled={props.disabled}
    >
      <span class="sr-only">{label || 'Toggle switch'}</span>
      <span
        class={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full 
          bg-white shadow ring-0 transition duration-200 ease-in-out
          ${isEnabled() ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
};

export default ToggleSwitch;