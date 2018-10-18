const state = {
    chozenNodes: []
};

const getters = {
    /*[types.DOUBLE_COUNTER]: state => { // doubleCounter
        return state.counter * 2;
    },
    [types.CLICK_COUNTER]: state => { // stringCounter
        return state.counter + ' Clicks';
    }*/
    nodesSelected: state => {
        return state.chozenNodes
    }
};

const mutations = {
    clearState: (state, payload) => {
        state.chozenNodes = []
    },
    addNode: (state, payload) => {
        if (state.chozenNodes.indexOf(payload) == -1) {
            state.chozenNodes.push(payload)
        } else {
            let index = state.chozenNodes.indexOf(payload)
            state.chozenNodes.splice(index, 1)
        }
        console.log(state.chozenNodes)
    }
};

const actions = {

}

export default {
    state,
    getters,
    mutations,
    actions
}