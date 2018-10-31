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
        //console.log('HERE');
        //console.log(state.chozenNodes);
        //console.log(payload);
        //console.log('TEST');
        //console.log(payload.id);
        //if (state.chozenNodes.indexOf(payload) === -1) {
        if (!state.chozenNodes.find(x => x.id === payload.id)) {
            state.chozenNodes.push(payload);
            //console.log('push');
        } else {
            let index = state.chozenNodes.indexOf(payload);
            state.chozenNodes.splice(index, 1);
            //console.log('splice');
        }
    },
    changeNodeSelection: (state, payload) => {
        state.selectedNodeId = payload;
    },
    initNodes: (state, payload) => {
        state.chozenNodes = payload;
        //console.log('Att2');
        //console.log(state.chozenNodes);
    }
};

const actions = {};

export default {
    state,
    getters,
    mutations,
    actions
}