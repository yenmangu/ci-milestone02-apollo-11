# Development

> [!NOTE]
> Return back to the [README.md](README.md) file.

> [!Note]
> This file outlines the choices I made in development for key aspecs of the Apollo 11 Lunar Descent simulation.
> due to the complexity and large number of resources needed for the simulation,
> I am also using it as a place to organise and store the necessary resources.

## Development aspects

### Timeline JSON

The entire simulation runs from the [timeline JSON](./data/timeline.json) file. This file details the various phases of the mission, as their own entries in the array.

#### `failure_state`

Each entry has a `failure_state` entry embedded, detailing the possible mission failure state associated that phase.

I have chosen this format, rather than a separate array of possible `failure_states` to ensure that each  state subclass only needs to worry about its own entry within the JSON. This keeps the memory required for each class to a minimum (rather than have to store the entire `failure_state` array, it only needs to store its related phase entry) and eliminates unecessary external lookups.

```json
[
	...
	 {
      "state": "powered_descent",
      "phase": "Powered Descent Initiation (PDI)",
      "start_time": 1020,
      "description": "DPS ignition at 10% throttle (102:45:00 GET)",
      "altitude_feet": 50000,
      "fuel_percent": 95,
      "required_action": "throttle_up",
      "audio_ref": "nasa/pdi_ignition.mp3",
      "failure_state": {
        "type": "ABORT_NO_IGNITION",
        "condition": "throttle_activation_time >8s",
        "audio_ref": "nasa/abort_pdi.mp3",
        "historical_context": "DPS had triple redundancy - never occurred"
      }
    },
	...
]
```

#### `metadata`

I have included in the `metadata` entry, a `global_failures` object, which contains failures that could be triggered by multiple phases.

This is to try and keep repetition within the JSON to a minimum, reducing overall file size.

The `metadata` also includes a default `time_scale` property, which can be overrided if need be, which allows the time to be 'warped'.

```json
"metadata": {
    "time_scale": 1.5,
    "global_failures": [
      {
        "type": "FUEL_EXHAUSTED",
        "condition": "fuel_percent <=0",
        "audio_ref": "nasa/fuel_exhausted.mp3",
        "applies_to": ["powered_descent", "braking_phase", "approach_phase", "final_descent"],
        "historical_context": "Real mission had 25s fuel remaining at touchdown"
      }
    ],
    "historical_references": {
      "time_format": "GET (Ground Elapsed Time)",
      "primary_source": "Apollo 11 Flight Journal (NASA)",
      "key_events": {
        "pdi_actual": "102:45:00 GET",
        "1202_alarm": "104:01:26 GET",
        "touchdown": "104:17:39 GET"
      }
    }
  }
```

### Finite State Machine

In order to reduce complexity within state management of the system, I decided to use the abstract model of a finite state machine to control the state management.

This approach ensures that each state is explicit, and follows a strict set of rules, reducing any bugs that can be introduced with multiple `if...else...` and `switch...case...` statements. By decided on the API for the states first (API driven development) I can then design each phase class to adhere to this API. This also ensures any future development or phases introduced can ***only*** be introduced by following these strict enforcements.

### Classes

I decided on an OOP approach to the project, to encapsulate the logic each 'component' requires.

I have used subclasses for the concrete states, to ensure each concrete state ***must*** implement the methods inherited by the super `MissionState` class.



