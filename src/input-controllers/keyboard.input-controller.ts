import { TypedObject } from '@/support/typed-object.support';
import { ControlKey } from '@/types/control-key.type';
import { InputCallback, InputEventType, InputObserver } from '@/types/input-observer.interface';

export interface KeyboardInputControllerConfig {
  keysMap: {
    [k in ControlKey]: string[];
  };
}

const DEFAULT_KEYBOARD_INPUT_CONTROLLER_CONFIG: KeyboardInputControllerConfig = {
  keysMap: {
    up: ['w', 'W'],
    left: ['a', 'A'],
    down: ['s', 'S'],
    right: ['d', 'D'],
    rotateClockwise: ['e', 'E'],
    rotateCounterClockwise: ['q', 'Q'],
  },
};

export class KeyboardInputController implements InputObserver {
  private callbacks: Array<[InputEventType, InputCallback]> = [];

  constructor(private config: KeyboardInputControllerConfig = DEFAULT_KEYBOARD_INPUT_CONTROLLER_CONFIG) {
    document.addEventListener('keydown', this.makeKeyEventListener('keyDown'));
    document.addEventListener('keyup', this.makeKeyEventListener('keyUp'));
  }

  public subscribe(eventType: InputEventType, callback: InputCallback): void {
    this.callbacks.push([eventType, callback]);
  }

  public unsubscribe(callback: InputCallback): void {
    this.callbacks = this.callbacks.filter((sCallback) => sCallback[1] !== callback);
  }

  private callCallbacks(callbacks: InputCallback[], key: ControlKey): void {
    callbacks.forEach((callback) => callback(key));
  }

  private getCallbacks(eventType: InputEventType): InputCallback[] {
    return this.callbacks.filter((callback) => callback[0] === eventType).map((callback) => callback[1]);
  }

  private makeKeyEventListener(eventType: InputEventType) {
    return (event: KeyboardEvent) => {
      const callbacks = this.getCallbacks(eventType);
      if (callbacks.length === 0) {
        return;
      }
      const eventKey = event.key;
      TypedObject.keys(this.config.keysMap).forEach((key: ControlKey) => {
        if (this.config.keysMap[key].includes(eventKey)) {
          this.callCallbacks(callbacks, key);
        }
      });
    };
  }
}
