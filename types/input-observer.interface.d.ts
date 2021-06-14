import { ControlKey } from '@/types/control-key.type';
export declare type InputCallback = (key: ControlKey) => void;
export declare type InputEventType = 'keyUp' | 'keyDown';
export interface InputObserver {
    subscribe(eventType: InputEventType, callback: InputCallback): void;
    unsubscribe(callback: InputCallback): void;
}
