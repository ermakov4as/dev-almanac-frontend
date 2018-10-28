const state = {
    chozenNodes: [],
    selectedNodeId: -1,
    nodeEditing: -1,
};

const getters = {
    nodesSelected: state => {
        return state.chozenNodes;
    },
    nodeSelected: state => {
        return state.selectedNodeId;
    },
    editingNode: state => {
        return state.nodeEditing;
    }
};

const mutations = {
    clearState: (state, payload) => {
        state.chozenNodes = [];
    },
    clearEditing: (state, payload) => {
        state.nodeEditing = -1;
    },
    toggleEditing: (state, payload) => {
        state.nodeEditing = payload;
    },
    toggleNode: (state, payload) => {
        if (state.chozenNodes.indexOf(payload) === -1) {
            state.chozenNodes.push(payload);
        } else {
            let index = state.chozenNodes.indexOf(payload);
            state.chozenNodes.splice(index, 1);
        }
    },
    changeNodeSelection: (state, payload) => {
        state.selectedNodeId = payload;
    },
    initNodes: (state, payload) => {
        state.chozenNodes = payload;
    }
};

const actions = {};

export default {
    state,
    getters,
    mutations,
    actions
}