const state = {
    chozenNodes: [],
    selectedNodeId: -1
};

const getters = {
    nodesSelected: state => {
        return state.chozenNodes
    },
    nodeSelected: state => {
        return state.selectedNodeId
    }
};

const mutations = {
    clearState: (state, payload) => {
        state.chozenNodes = []
    },
    toggleNode: (state, payload) => {
        if (state.chozenNodes.indexOf(payload) === -1) {
            state.chozenNodes.push(payload)
        } else {
            let index = state.chozenNodes.indexOf(payload);
            state.chozenNodes.splice(index, 1);
        }
    },
    changeNodeSelection: (state, payload) => {
        state.selectedNodeId = payload
    },
    initNodes: (state, payload) => {
        state.chozenNodes = payload
    }
};

const actions = {};

export default {
    state,
    getters,
    mutations,
    actions
}