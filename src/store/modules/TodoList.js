import axiosAuth from '@/store/api/BaseAxios';

export default {
    namespaced: true,
    state: {
        /**
         * list: [{
         *     id: Number, // 각 todoslit의 id(할일 아이디) : device의 고유번호를 넣어주면 됨. axios get 테스트 시에는 1을 사용
         *     text: String, // 할일 내용, 기존의 title
         *     state: Number, // 상태값(1: 미완료, 2: 완료)
         *     created_at: String, // 생성일시(format: 2021-05-13 08:57:55)
         *     updated_at: String, // 수정일시(format: 2021-05-13 09:06:16)
         * }]
         */
        list: [],
        listFilter: "all",
        orderBy: "desc",
    },
    getters: {
        getTodoList(state) {
            let todoList = state.list

            if (state.listFilter === "active") {
                todoList = state.list.filter((item) => item.state === 1)
            } else if (state.listFilter === "completed") {
                todoList = state.list.filter((item) => item.state === 2)
            }

            return todoList
        },
        getCountAllList(state) {
            return state.list.length
        },
        getCountCompletedList(state) {
            return state.list.filter((item) => item.state === 2).length
        },
    },
    mutations: {
        setFilter(state, filter) {
            state.listFilter = filter
        },
        setTodoList(state, todoList) {
            state.list = todoList
        },
        setOrderBy(state, orderBy) {
            state.orderBy = orderBy
        },
        toggleTodo(state, todo) {
            const index = state.list.indexOf(todo)
            if (index > -1) state.list[index].state = todo.state
        },
        removeTodo(state, todo) {
            const index = state.list.indexOf(todo)
            if (index > -1) state.list.splice(index, 1)
        },
        listClearAll(state) {
            state.list.splice(0)
        },
        listSort(state) {
            if(state.list.length > 0) {
                console.log('sort mutation')
                if(state.orderBy === 'asc') {
                    console.log('sort asc')
                    state.list.sort(function (a, b) {
                        return new Date(a.created_at) - new Date(b.created_at)
                    })
                } else {
                    console.log('sort desc')
                    state.list.sort(function (a, b) {
                        return new Date(b.created_at) - new Date(a.created_at)
                    })
                }
            }
        },
        addTodo(state, item) {
            if (state.orderBy === "asc") {
                state.list.unshift(item)
            } else {
                state.list.push(item)
            }
        },
    },
    actions: {
        setFilter({commit}, filter) {
            commit("setFilter", filter)
        },

        setTodoList({ commit }, todoList) {
            // commit("setTodoList", todoList)
            return axiosAuth().get(`/api/v1/todos/${todoList}`)
                .then(data => {
                    commit('setTodoList', data);
                    console.log('클릭');
                });
        },

        setOrderBy({commit}, item) {
            // 정렬값 저장
            commit("setOrderBy", item)
            // 리스트 정렬
            commit('listSort')

            localStorage.setItem("todo-orderby", item)
        },

        // 데이터 추가
        addTodo({commit}, item) {
            commit("addTodo", item)
        },

        // 전체 삭제.
        clearAll({commit}) {
            commit("listClearAll")
        },

        // list item 하나에 대한 삭제
        removeTodo({commit}, todo) {
            commit("removeTodo", todo)
        },

        // 리스트 아이템 토글
        toggleTodo({commit}, todo) {
            commit("toggleTodo", todo)
        },
    },
}
