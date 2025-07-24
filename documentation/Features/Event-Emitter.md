**Design Note: Custom EventEmitter in Apollo 11 Simulation**

---

### Motivation

Rather than relying on external libraries like Node.js's `EventEmitter` or third-party pub-sub packages, I implemented my own simple `EventEmitter` class. This decision was guided by my desire to:

* Learn and master the fundamentals of event-driven architecture.
* Avoid introducing unnecessary dependencies.
* Gain full control over the behaviour, debugging, and extension of the event system.

---

### Benefits of a Custom Emitter

**1. Educational Value**

* Building the system from scratch reinforced my understanding of listeners, event typing, and callback management.

**2. Zero Overhead**

* Lightweight and free of features I don't need (e.g., max listener tracking, once-only constraints).
* Better suited for low-latency cue dispatch and real-time UI updates.

**3. Platform Independence**

* Works in browser or Node without shims or polyfills.
* Portable to future non-JS platforms via translation or adaptation.

**4. Simpler Debugging**

* Call flow is transparent because all logic is self-authored.
* Debugging emitted events or listener issues is easier without black-box layers.

---

### Supported Features

My emitter currently supports:

* Subscribing to named events via `.on(eventName, callback)`
* Unsubscribing via `.off(eventName, callback)`
* Emitting via `.emit(eventName, payload)`
* Multiple listeners per event

This implementation is sufficient for:

* Dispatching cue-related input events (e.g., KEY REL, PRO)
* Managing system-level signals (e.g., fast-forward, simulation pause)
* Supporting modular UI reactions (e.g., DSKY keypresses)

---

### Future Considerations

I may later add:

* `.once(eventName, callback)` for one-time listeners.
* Support for wildcard event types (e.g., `*` for logging/debugging).
* Listener inspection and count (for memory safety).

For now, this minimal design is intentional and complete for my current architecture.

---

### Canonical Source

This EventEmitter class is considered the canonical base for all pub-sub behaviour in the simulator unless otherwise specified. Any new event systems should inherit or follow this pattern unless I have a clear reason to do otherwise.
