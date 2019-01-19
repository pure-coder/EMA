// Save state to local Storage

// function to load any saved state from local storage
export const loadState = () => {
    try{
        const serializedState = localStorage.getItem('state')
        // return undefined if null so the program does not crash
        if (serializedState === null) {
            return undefined
        }
        // return the parsed json object otherwise, it is parsed from a string back into an object
        //let state = {authenticatedUser: JSON.parse(serializedState)}
        return JSON.parse(serializedState)
    }
    catch (err) {
        return undefined
    }
}

export const saveState = (state) => {
    try {
        // stringify the state as local storage can only save strings
        const serializedState = JSON.stringify(state)
        // save the state as 'state' in local storage
        localStorage.setItem('state', serializedState)
    }
    catch (err) {
        // ignore write errors
    }
}