export class EventEmitter<T = void> {
    private subscribers = new Set<(payload: T) => void>();

    on(fn: (payload: T) => void) {
        this.subscribers.add(fn);
    }

    off(fn: (payload: T) => void) {
        this.subscribers.delete(fn);
    }

    emit(payload: T) {
        this.subscribers.forEach(fn => fn(payload));
    }
}