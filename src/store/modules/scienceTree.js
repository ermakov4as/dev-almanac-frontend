const state = {
    chozenNodes: [],
    removedNodeId: -1
};

const getters = {
    nodesSelected: state => {
        return state.chozenNodes
    },
    nodeRemoved: state => {
        return state.removedNodeId
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
    removeNode: (state, payload) => {
        state.removedNodeId = payload
            //console.log('removed' + state.removedNodeId)
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