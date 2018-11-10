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
    // Очищаем список выбранных нод
    clearState: (state, payload) => {
        state.chozenNodes = [];
    },

    // Меняем редактируемую ноду на дефолтную фиктивную
    clearEditing: (state, payload) => {
        state.nodeEditing = -1;
    },

    // Меняем редактируемую ноду
    toggleEditing: (state, payload) => {
        state.nodeEditing = payload;
    },

    // Добавляем нод в список выбранных (если ещё нет) или удаляем из него (если уже есть)
    toggleNode: (state, payload) => {
        if (!state.chozenNodes.find(x => x.id === payload.id)) {
            state.chozenNodes.push(payload);
        } else {
            let index = state.chozenNodes.indexOf(payload);
            state.chozenNodes.splice(index, 1);
        };
    },

    // Меняем id выбранной ноды
    changeNodeSelection: (state, payload) => {
        state.selectedNodeId = payload;
    },

    // Определяем начальный набор выбранных нод
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
};