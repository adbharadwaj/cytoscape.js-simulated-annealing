(function () {
    "use strict";
    window.SimulatedAnnealing = function (userConfig) {
        var _extend = function (a, b) {
            for (var key in b) {
                if (b.hasOwnProperty(key)) {
                    a[key] = b[key];
                }
            }
            return a;
        };
        var _clone = function (obj) {
            if(obj == null || typeof(obj) != 'object')
                return obj;

            var temp = obj.constructor(); // changed

            for(var key in obj)
                temp[key] = _clone(obj[key]);
            return temp;
        };

        var defaultConfig = {
            initialTemperature: 100,
            temperatureDecreaseRate: 0.99,
            iterations: 1,
            steps: 10,
            getInitialState : function (temperature) {
                return Promise.resolve({
                    value: temperature
                });
            },
            getNeighboringState : function (state, temperature) {
                return Promise.resolve({
                    value: state.value + (temperature / 2 - temperature * Math.random())
                });
            },
            calculateEnergy : function (state) {
                return Promise.resolve(Math.abs(state.value));
            },
            terminatingCondition : function (state, temperature) {
                return temperature === 0 || _currentIteration >= config.iterations;
            },
            decreaseTemperature : function (state, energy, temperature){
                return temperature * config.temperatureDecreaseRate;
            },
            decideChange : function (newEnergy, oldEnergy, temperature) {
                var delta = newEnergy - oldEnergy;
                if (delta < 0) {
                    return true;
                }

                var C = Math.exp(-delta / temperature);
                var R = Math.random();

                return R < C;
            },
            discardChange : function (currentState, nextState) {
                return Promise.resolve();
            },
            acceptChange : function (currentState, newState) {
                _currentState = _clone(newState);
                return Promise.resolve();
            },
            onStep:  function (obj) {
                console.log(obj);
            }
        };

        var config = _extend(defaultConfig, userConfig);

        var _currentState,
            _currentStep,
            _currentIteration,
            _currentEnergy,
            _currentTemperature;

        return {
            doStep : function () {
                var _nextState, _energy;
                return config.getNeighboringState(_currentState, _currentTemperature)
                    .then(function (nextState) {
                        _nextState = nextState;
                        return config.calculateEnergy(nextState)
                    })
                    .then(function (energy) {
                        if (!config.decideChange(energy, _currentEnergy, _currentTemperature)) {
                            return config.discardChange(_currentState, _nextState).then(function () {
                                _currentStep += 1;
                                return Promise.resolve();;
                            });
                        } else {
                            _energy = energy;
                            return config.acceptChange(_currentState, _nextState).then(function(){
                                _currentStep += 1;
                                _currentEnergy = _energy;
                                return Promise.resolve();
                            });
                        }
                    });
            },
            init : function () {
                _currentTemperature = config.initialTemperature;
                return config.getInitialState(_currentTemperature)
                        .then(function (currentState) {
                            _currentState = currentState
                            return config.calculateEnergy(currentState);
                        })
                        .then(function(currentEnergy){
                            _currentEnergy = currentEnergy;
                            _currentIteration = 0;
                            return Promise.resolve();
                        });
            },
            doIteration: function () {
                var sa = this;
                return sa.doStep().then(function () {
                    config.onStep(sa.getCurrentObject());
                    if (_currentStep < config.steps) {
                        return sa.doIteration();
                    } else {
                        return Promise.resolve();
                    }
                });
            },
            anneal: function () {
                var sa = this;
                _currentStep = 0;
                return sa.doIteration().then(function () {
                    _currentTemperature = config.decreaseTemperature(_currentState, _currentEnergy, _currentTemperature);
                    _currentIteration += 1
                    if (!config.terminatingCondition(_currentState, _currentTemperature)) {
                        return sa.anneal();
                    } else {
                        return sa.getCurrentObject();
                    }
                });
            },
            run : function () {
                var sa = this;
                return sa.init().then(function () {
                    return sa.anneal().then(function(currentObject){
                        return currentObject;
                    })
                });
            },
            getCurrentObject : function () {
                return {
                    state: _currentState,
                    energy: _currentEnergy,
                    temperature: _currentTemperature,
                    steps: _currentStep,
                    iterations: _currentIteration
                };
            }
        };
    };
})();
