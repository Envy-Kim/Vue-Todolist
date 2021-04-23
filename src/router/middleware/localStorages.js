import store from "@/store/index";

export function checkLocalStorages(to, from, next) {
  if (localStorage.getItem("todo-filter")) {
    store.dispatch("Todo/setFilter", localStorage.getItem("todo-filter"));
  }
  if (localStorage.getItem("todo-list")) {
    store.dispatch(
      "Todo/setTodoList",
      JSON.parse(localStorage.getItem("todo-list"))
    );
  }
  if (localStorage.getItem("todo-select")) {
    store.dispatch(
      "Todo/setSelect",
      JSON.parse(localStorage.getItem("todo-select"))
    );
  }
  next();
}
