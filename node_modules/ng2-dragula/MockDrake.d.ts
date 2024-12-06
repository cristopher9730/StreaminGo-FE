import { DrakeWithModels } from './DrakeWithModels';
import { EventTypes } from './EventTypes';
import { DragulaOptions } from './DragulaOptions';
import { DrakeFactory } from './DrakeFactory';
import { Drake } from 'dragula';
export declare const MockDrakeFactory: DrakeFactory;
/** You can use MockDrake to simulate Drake events.
 *
 * The three methods that actually do anything are `on(event, listener)`,
 * `destroy()`, and a new method, `emit()`. Use `emit()` to manually emit Drake
 * events, and if you injected MockDrake properly with MockDrakeFactory or
 * mocked the DragulaService.find() method, then you can make ng2-dragula think
 * drags and drops are happening.
 *
 * Caveats:
 *
 * 1. YOU MUST MAKE THE DOM CHANGES YOURSELF.
 * 2. REPEAT: YOU MUST MAKE THE DOM CHANGES YOURSELF.
 *    That means `source.removeChild(el)`, and `target.insertBefore(el)`.
 * 3. None of the other methods do anything.
 *    That's ok, because ng2-dragula doesn't use them.
 */
export declare class MockDrake implements DrakeWithModels {
    containers: Element[];
    options: DragulaOptions;
    models?: any[][] | undefined;
    private emitter$;
    private subs;
    /**
     * @param containers A list of container elements.
     * @param options These will NOT be used. At all.
     * @param models Nonstandard, but useful for testing using `new MockDrake()` directly.
     *               Note, default value is undefined, like a real Drake. Don't change that.
     */
    constructor(containers?: Element[], options?: DragulaOptions, models?: any[][] | undefined);
    on(event: 'drag', listener: (el: Element, source: Element) => void): Drake;
    on(event: 'dragend', listener: (el: Element) => void): Drake;
    on(event: 'drop', listener: (el: Element, target: Element, source: Element, sibling: Element) => void): Drake;
    on(event: 'cancel' | 'remove' | 'shadow' | 'over' | 'out', listener: (el: Element, container: Element, source: Element) => void): Drake;
    on(event: 'cloned', listener: (clone: Element, original: Element, type: 'copy' | 'mirror') => void): Drake;
    on(event: 'dropModel', listener: ([el, target, source, sibling, item, sourceModel, targetModel, sourceIndex, targetIndex,]: [Element, Element, Element, Element, any, any[], any[], number, number]) => void): Drake;
    on(event: 'removeModel', listener: ([el, container, source, item, sourceModel, sourceIndex]: [Element, Element, Element, any, any[], number]) => void): Drake;
    dragging: boolean;
    start(item: Element): any;
    end(): any;
    cancel(revert: boolean): any;
    cancel(): any;
    canMove(item: Element): boolean;
    remove(): any;
    destroy(): any;
    /**
     * This is the most useful method. You can use it to manually fire events that would normally
     * be fired by a real drake.
     *
     * You're likely most interested in firing `drag`, `remove` and `drop`, the three events
     * DragulaService uses to implement [dragulaModel].
     *
     * See https://github.com/bevacqua/dragula#drakeon-events for what you should emit (and in what order).
     *
     * (Note also, firing dropModel and removeModel won't work. You would have to mock DragulaService for that.)
     */
    emit(eventType: EventTypes, ...args: any[]): void;
}
