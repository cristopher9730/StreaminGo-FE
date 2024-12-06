import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EventTypes } from './EventTypes';
import { DrakeFactory } from './DrakeFactory';
export const MockDrakeFactory = new DrakeFactory((containers, options) => {
    return new MockDrake(containers, options);
});
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
export class MockDrake {
    /**
     * @param containers A list of container elements.
     * @param options These will NOT be used. At all.
     * @param models Nonstandard, but useful for testing using `new MockDrake()` directly.
     *               Note, default value is undefined, like a real Drake. Don't change that.
     */
    constructor(containers = [], options = {}, models) {
        this.containers = containers;
        this.options = options;
        this.models = models;
        // Basic but fully functional event emitter shim
        this.emitter$ = new Subject();
        this.subs = new Subscription();
        /* Doesn't represent anything meaningful. */
        this.dragging = false;
    }
    on(event, callback) {
        this.subs.add(this.emitter$
            .pipe(filter(({ eventType }) => eventType === event))
            .subscribe(({ eventType, args }) => {
            if (eventType === EventTypes.Drag) {
                const argument = Array.from(args);
                const el = argument[0];
                const source = argument[1];
                //@ts-ignore
                callback(el, source);
                return;
            }
            if (eventType === EventTypes.Drop) {
                const argument = Array.from(args);
                const el = argument[0];
                const target = argument[1];
                const source = argument[2];
                const sibling = argument[3];
                //@ts-ignore
                callback(el, target, source, sibling);
                return;
            }
            if (eventType === EventTypes.Remove) {
                const argument = Array.from(args);
                const el = argument[0];
                const container = argument[1];
                const source = argument[2];
                //@ts-ignore
                callback(el, container, source);
                return;
            }
            callback(args);
        }));
    }
    /* Does nothing useful. */
    start(item) {
        this.dragging = true;
    }
    /* Does nothing useful. */
    end() {
        this.dragging = false;
    }
    cancel(revert) {
        this.dragging = false;
    }
    /* Does nothing useful. */
    canMove(item) {
        return this.options.accepts ? this.options.accepts(item) : false;
    }
    /* Does nothing useful. */
    remove() {
        this.dragging = false;
    }
    destroy() {
        this.subs.unsubscribe();
    }
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
    emit(eventType, ...args) {
        this.emitter$.next({ eventType, args });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9ja0RyYWtlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGlicy9uZzItZHJhZ3VsYS9zcmMvTW9ja0RyYWtlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRTdDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRTFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUc5QyxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLFlBQVksQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsRUFBRTtJQUN2RSxPQUFPLElBQUksU0FBUyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM1QyxDQUFDLENBQUMsQ0FBQztBQUVIOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE1BQU0sT0FBTyxTQUFTO0lBS3BCOzs7OztPQUtHO0lBQ0gsWUFDUyxhQUF3QixFQUFFLEVBQzFCLFVBQTBCLEVBQUUsRUFDNUIsTUFBZ0I7UUFGaEIsZUFBVSxHQUFWLFVBQVUsQ0FBZ0I7UUFDMUIsWUFBTyxHQUFQLE9BQU8sQ0FBcUI7UUFDNUIsV0FBTSxHQUFOLE1BQU0sQ0FBVTtRQWJ6QixnREFBZ0Q7UUFDeEMsYUFBUSxHQUFHLElBQUksT0FBTyxFQUEwQyxDQUFDO1FBQ2pFLFNBQUksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBNERsQyw0Q0FBNEM7UUFDNUMsYUFBUSxHQUFHLEtBQUssQ0FBQztJQWpEZCxDQUFDO0lBU0osRUFBRSxDQUFDLEtBQWEsRUFBRSxRQUE4QjtRQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUTthQUN4QixJQUFJLENBQ0gsTUFBTSxDQUFDLENBQUMsRUFB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b3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBEcmFrZVdpdGhNb2RlbHMgfSBmcm9tICcuL0RyYWtlV2l0aE1vZGVscyc7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBFdmVudFR5cGVzIH0gZnJvbSAnLi9FdmVudFR5cGVzJztcbmltcG9ydCB7IERyYWd1bGFPcHRpb25zIH0gZnJvbSAnLi9EcmFndWxhT3B0aW9ucyc7XG5pbXBvcnQgeyBEcmFrZUZhY3RvcnkgfSBmcm9tICcuL0RyYWtlRmFjdG9yeSc7XG5pbXBvcnQgeyBEcmFrZSB9IGZyb20gJ2RyYWd1bGEnO1xuXG5leHBvcnQgY29uc3QgTW9ja0RyYWtlRmFjdG9yeSA9IG5ldyBEcmFrZUZhY3RvcnkoKGNvbnRhaW5lcnMsIG9wdGlvbnMpID0+IHtcbiAgcmV0dXJuIG5ldyBNb2NrRHJha2UoY29udGFpbmVycywgb3B0aW9ucyk7XG59KTtcblxuLyoqIFlvdSBjYW4gdXNlIE1vY2tEcmFrZSB0byBzaW11bGF0ZSBEcmFrZSBldmVudHMuXG4gKlxuICogVGhlIHRocmVlIG1ldGhvZHMgdGhhdCBhY3R1YWxseSBkbyBhbnl0aGluZyBhcmUgYG9uKGV2ZW50LCBsaXN0ZW5lcilgLFxuICogYGRlc3Ryb3koKWAsIGFuZCBhIG5ldyBtZXRob2QsIGBlbWl0KClgLiBVc2UgYGVtaXQoKWAgdG8gbWFudWFsbHkgZW1pdCBEcmFrZVxuICogZXZlbnRzLCBhbmQgaWYgeW91IGluamVjdGVkIE1vY2tEcmFrZSBwcm9wZXJseSB3aXRoIE1vY2tEcmFrZUZhY3Rvcnkgb3JcbiAqIG1vY2tlZCB0aGUgRHJhZ3VsYVNlcnZpY2UuZmluZCgpIG1ldGhvZCwgdGhlbiB5b3UgY2FuIG1ha2UgbmcyLWRyYWd1bGEgdGhpbmtcbiAqIGRyYWdzIGFuZCBkcm9wcyBhcmUgaGFwcGVuaW5nLlxuICpcbiAqIENhdmVhdHM6XG4gKlxuICogMS4gWU9VIE1VU1QgTUFLRSBUSEUgRE9NIENIQU5HRVMgWU9VUlNFTEYuXG4gKiAyLiBSRVBFQVQ6IFlPVSBNVVNUIE1BS0UgVEhFIERPTSBDSEFOR0VTIFlPVVJTRUxGLlxuICogICAgVGhhdCBtZWFucyBgc291cmNlLnJlbW92ZUNoaWxkKGVsKWAsIGFuZCBgdGFyZ2V0Lmluc2VydEJlZm9yZShlbClgLlxuICogMy4gTm9uZSBvZiB0aGUgb3RoZXIgbWV0aG9kcyBkbyBhbnl0aGluZy5cbiAqICAgIFRoYXQncyBvaywgYmVjYXVzZSBuZzItZHJhZ3VsYSBkb2Vzbid0IHVzZSB0aGVtLlxuICovXG5leHBvcnQgY2xhc3MgTW9ja0RyYWtlIGltcGxlbWVudHMgRHJha2VXaXRoTW9kZWxzIHtcbiAgLy8gQmFzaWMgYnV0IGZ1bGx5IGZ1bmN0aW9uYWwgZXZlbnQgZW1pdHRlciBzaGltXG4gIHByaXZhdGUgZW1pdHRlciQgPSBuZXcgU3ViamVjdDx7IGV2ZW50VHlwZTogRXZlbnRUeXBlcywgYXJnczogYW55W10gfT4oKTtcbiAgcHJpdmF0ZSBzdWJzID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gY29udGFpbmVycyBBIGxpc3Qgb2YgY29udGFpbmVyIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBUaGVzZSB3aWxsIE5PVCBiZSB1c2VkLiBBdCBhbGwuXG4gICAqIEBwYXJhbSBtb2RlbHMgTm9uc3RhbmRhcmQsIGJ1dCB1c2VmdWwgZm9yIHRlc3RpbmcgdXNpbmcgYG5ldyBNb2NrRHJha2UoKWAgZGlyZWN0bHkuXG4gICAqICAgICAgICAgICAgICAgTm90ZSwgZGVmYXVsdCB2YWx1ZSBpcyB1bmRlZmluZWQsIGxpa2UgYSByZWFsIERyYWtlLiBEb24ndCBjaGFuZ2UgdGhhdC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBjb250YWluZXJzOiBFbGVtZW50W10gPSBbXSxcbiAgICBwdWJsaWMgb3B0aW9uczogRHJhZ3VsYU9wdGlvbnMgPSB7fSxcbiAgICBwdWJsaWMgbW9kZWxzPzogYW55W11bXVxuICApIHt9XG4gIG9uKGV2ZW50OiAnZHJhZycsIGxpc3RlbmVyOiAoZWw6IEVsZW1lbnQsIHNvdXJjZTogRWxlbWVudCkgPT4gdm9pZCk6IERyYWtlO1xuICBvbihldmVudDogJ2RyYWdlbmQnLCBsaXN0ZW5lcjogKGVsOiBFbGVtZW50KSA9PiB2b2lkKTogRHJha2U7XG4gIG9uKGV2ZW50OiAnZHJvcCcsIGxpc3RlbmVyOiAoZWw6IEVsZW1lbnQsIHRhcmdldDogRWxlbWVudCwgc291cmNlOiBFbGVtZW50LCBzaWJsaW5nOiBFbGVtZW50KSA9PiB2b2lkKTogRHJha2U7XG4gIG9uKGV2ZW50OiAnY2FuY2VsJyB8ICdyZW1vdmUnIHwgJ3NoYWRvdycgfCAnb3ZlcicgfCAnb3V0JywgbGlzdGVuZXI6IChlbDogRWxlbWVudCwgY29udGFpbmVyOiBFbGVtZW50LCBzb3VyY2U6IEVsZW1lbnQpID0+IHZvaWQpOiBEcmFrZTtcbiAgb24oZXZlbnQ6ICdjbG9uZWQnLCBsaXN0ZW5lcjogKGNsb25lOiBFbGVtZW50LCBvcmlnaW5hbDogRWxlbWVudCwgdHlwZTogJ2NvcHknIHwgJ21pcnJvcicpID0+IHZvaWQpOiBEcmFrZTtcbiAgb24oZXZlbnQ6ICdkcm9wTW9kZWwnLCBsaXN0ZW5lcjogKFtlbCwgdGFyZ2V0LCBzb3VyY2UsIHNpYmxpbmcsIGl0ZW0sIHNvdXJjZU1vZGVsLCB0YXJnZXRNb2RlbCwgc291cmNlSW5kZXgsIHRhcmdldEluZGV4LF06IFtFbGVtZW50LCBFbGVtZW50LCBFbGVtZW50LCBFbGVtZW50LCBhbnksIGFueVtdLCBhbnlbXSwgbnVtYmVyLCBudW1iZXJdKSA9PiB2b2lkKTogRHJha2U7XG4gIG9uKGV2ZW50OiAncmVtb3ZlTW9kZWwnLCBsaXN0ZW5lcjogKFtlbCwgY29udGFpbmVyLCBzb3VyY2UsIGl0ZW0sIHNvdXJjZU1vZGVsLCBzb3VyY2VJbmRleF06IFtFbGVtZW50LCBFbGVtZW50LCBFbGVtZW50LCBhbnksIGFueVtdLCBudW1iZXJdKSA9PiB2b2lkKTogRHJha2U7XG4gIFxuICBvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogKC4uLmFyZ3M6IGFueSk9PiBhbnkpOiBhbnkge1xuICAgIHRoaXMuc3Vicy5hZGQodGhpcy5lbWl0dGVyJFxuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcigoeyBldmVudFR5cGUgfSkgPT4gZXZlbnRUeXBlID09PSBldmVudClcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKHtldmVudFR5cGUsIGFyZ3N9ICkgPT4ge1xuICAgICAgICBpZiAoZXZlbnRUeXBlID09PSBFdmVudFR5cGVzLkRyYWcpIHtcbiAgICAgICAgICBjb25zdCBhcmd1bWVudCA9IEFycmF5LmZyb20oYXJncyk7XG4gICAgICAgICAgY29uc3QgZWwgPSBhcmd1bWVudFswXTtcbiAgICAgICAgICBjb25zdCBzb3VyY2UgPSBhcmd1bWVudFsxXTtcbiAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICBjYWxsYmFjayhlbCwgc291cmNlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnRUeXBlID09PSBFdmVudFR5cGVzLkRyb3ApIHtcbiAgICAgICAgICBjb25zdCBhcmd1bWVudCA9IEFycmF5LmZyb20oYXJncyk7XG4gICAgICAgICAgY29uc3QgZWwgPSBhcmd1bWVudFswXTtcbiAgICAgICAgICBjb25zdCB0YXJnZXQgPSBhcmd1bWVudFsxXTtcbiAgICAgICAgICBjb25zdCBzb3VyY2UgPSBhcmd1bWVudFsyXTtcbiAgICAgICAgICBjb25zdCBzaWJsaW5nID0gYXJndW1lbnRbM107XG4gICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgY2FsbGJhY2soZWwsIHRhcmdldCwgc291cmNlLCBzaWJsaW5nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnRUeXBlID09PSBFdmVudFR5cGVzLlJlbW92ZSkge1xuICAgICAgICAgIGNvbnN0IGFyZ3VtZW50ID0gQXJyYXkuZnJvbShhcmdzKTtcbiAgICAgICAgICBjb25zdCBlbCA9IGFyZ3VtZW50WzBdO1xuICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGFyZ3VtZW50WzFdO1xuICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IGFyZ3VtZW50WzJdO1xuICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgIGNhbGxiYWNrKGVsLCBjb250YWluZXIsIHNvdXJjZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNhbGxiYWNrKGFyZ3MpO1xuICAgICAgfSkpO1xuICB9XG5cbiAgLyogRG9lc24ndCByZXByZXNlbnQgYW55dGhpbmcgbWVhbmluZ2Z1bC4gKi9cbiAgZHJhZ2dpbmcgPSBmYWxzZTtcblxuICAvKiBEb2VzIG5vdGhpbmcgdXNlZnVsLiAqL1xuICBzdGFydChpdGVtOiBFbGVtZW50KTogYW55IHtcbiAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcbiAgfVxuICAvKiBEb2VzIG5vdGhpbmcgdXNlZnVsLiAqL1xuICBlbmQoKTogYW55IHtcbiAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG4gIH1cbiAgLyogRG9lcyBub3RoaW5nIHVzZWZ1bC4gKi9cbiAgY2FuY2VsKHJldmVydDogYm9vbGVhbik6IGFueTtcbiAgY2FuY2VsKCk6IGFueTtcbiAgY2FuY2VsKHJldmVydD86IGFueSkge1xuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIC8qIERvZXMgbm90aGluZyB1c2VmdWwuICovXG4gIGNhbk1vdmUoaXRlbTogRWxlbWVudCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYWNjZXB0cyA/IHRoaXMub3B0aW9ucy5hY2NlcHRzKGl0ZW0pIDogZmFsc2U7XG4gIH1cblxuICAvKiBEb2VzIG5vdGhpbmcgdXNlZnVsLiAqL1xuICByZW1vdmUoKTogYW55IHtcbiAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG4gIH1cblxuICBkZXN0cm95KCk6IGFueSB7XG4gICAgdGhpcy5zdWJzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBpcyB0aGUgbW9zdCB1c2VmdWwgbWV0aG9kLiBZb3UgY2FuIHVzZSBpdCB0byBtYW51YWxseSBmaXJlIGV2ZW50cyB0aGF0IHdvdWxkIG5vcm1hbGx5XG4gICAqIGJlIGZpcmVkIGJ5IGEgcmVhbCBkcmFrZS5cbiAgICpcbiAgICogWW91J3JlIGxpa2VseSBtb3N0IGludGVyZXN0ZWQgaW4gZmlyaW5nIGBkcmFnYCwgYHJlbW92ZWAgYW5kIGBkcm9wYCwgdGhlIHRocmVlIGV2ZW50c1xuICAgKiBEcmFndWxhU2VydmljZSB1c2VzIHRvIGltcGxlbWVudCBbZHJhZ3VsYU1vZGVsXS5cbiAgICpcbiAgICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXZhY3F1YS9kcmFndWxhI2RyYWtlb24tZXZlbnRzIGZvciB3aGF0IHlvdSBzaG91bGQgZW1pdCAoYW5kIGluIHdoYXQgb3JkZXIpLlxuICAgKlxuICAgKiAoTm90ZSBhbHNvLCBmaXJpbmcgZHJvcE1vZGVsIGFuZCByZW1vdmVNb2RlbCB3b24ndCB3b3JrLiBZb3Ugd291bGQgaGF2ZSB0byBtb2NrIERyYWd1bGFTZXJ2aWNlIGZvciB0aGF0LilcbiAgICovXG4gIGVtaXQoZXZlbnRUeXBlOiBFdmVudFR5cGVzLCAuLi5hcmdzOiBhbnlbXSkge1xuICAgIHRoaXMuZW1pdHRlciQubmV4dCh7IGV2ZW50VHlwZSwgYXJncyB9KTtcbiAgfVxuXG59XG4iXX0=