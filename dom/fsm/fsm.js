function FSM(config) {
    this.config = config;
    this.currentState = this.config.initState;
    this.channel= {}
    this.states = this.config.states;
    // this.events = this.config.events;
    this.defineEvents(this.config.events);
}

FSM.prototype = {
    // 事件驱动状态转换(表现层)
    handleEvents: function (type, ev) {
        if (!this.currentState) return;
        
        var actionTransitionFunction = this.states[this.currentState][type];
        
        if (!actionTransitionFunction) {
            if (this.config.error) this.config.error.call(this, type, ev)
            return;
        }
        
        var nextState = actionTransitionFunction.call(this, type, ev);
        
        this.currentState = nextState;
    },
    
    // 定义事件 (行为层)
    defineEvents: function (events) {
        for (let k in events) {
            var fn = events[k];
            fn.call(this, e => this.emit(k, e));
            this.on(k, this.handleEvents);
        }
    },

    
    emit(evName, ev) {
        if (evName in this.channel) {
            this.channel[evName].call(this, evName, ev)
        }
    },
    
    on(evName, fn) {
        this.channel[evName] = fn
    }
}



// -------------------

const $ = q => document.querySelector(q)
let $warn = $("#warn")
let $ready = $("#ready")
let $stop = $("#stop")
let $go = $("#go")
let $light = $(".light")


let f = new FSM({
    initState: "green",
    states: {
        green: {
            warn(type, ev) {
                console.log("warn!")
                $light.style.cssText = "    background-color: yellow;"
                $light.innerHTML = "warn";
                return "yellow"
            }
        },
        red: {
            ready(type, ev) {
                console.log("ready to go")
                $light.style.cssText = "    background-color: yellow;"
                $light.innerHTML = "ready";
                return "yellow"
            }
        },
        yellow: {
            go(type, ev) {
                console.log("go!")
                $light.style.cssText = "    background-color: green;"
                $light.innerHTML = "go";
                return "green"
            },
            stop(type, ev) {
                console.log("stop!now!")
                $light.style.cssText = "    background-color: red;"
                $light.innerHTML = "stop";
                return "red"
            }
        }
    },
    events: {
        warn(fn) {
            $warn.onclick = fn
        },
        ready(fn) {
            $ready.onclick = fn
        },
        go(fn) {
            $go.onclick = fn
        },
        stop(fn) {
            $stop.onclick = fn
        }
    },
    error(to, ev) {
        console.log(`${this.currentState} =/=> ${to} !`)
    }
})

// setInterval(()=>{
//     f.emit("go")
//     f.emit("ready")
//     f.emit("stop")
//     f.emit("warn")
// },1000)

