const state = {
    chozenNodes: []
};

const getters = {
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