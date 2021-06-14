import { ControlKey } from '@/types/control-key.type';
import { InputCallback, InputEventType, InputObserver } from '@/types/input-observer.interface';
export interface KeyboardInputControllerConfig {
    keysMap: {
        [k in ControlKey]: string[];
    };
}
export declare class KeyboardInputController implements InputObserver {
    private config;
    private callbacks;
    constructor(config?: KeyboardInputControllerConfig);
    subscribe(eventType: InputEventType, callback: InputCallback): void;
    unsubscribe(callback: InputCallback): void;
    private callCallbacks;
    private getCallbacks;
    private makeKeyEventListener;
}
