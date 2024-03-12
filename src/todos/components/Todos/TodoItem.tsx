import styles from "./TodoItem.module.css";
import { IoCheckboxOutline } from "react-icons/io5";
import { Todo } from "@prisma/client";
import { startTransition, useOptimistic } from "react";
interface Props {
  todo: Todo;

  toggleTodo: (id: string, complete: boolean) => Promise<Todo>;
}

export const TodoItem = ({ toggleTodo, todo }: Props) => {
  const [todoOptimistic, toggleTodoOptimistic] = useOptimistic(
    todo,
    (state, newCompleteValue: boolean) => ({
      ...state,
      complete: newCompleteValue,
    })
  );

  const onToggleTodo = async () => {
    try {
      startTransition(() => toggleTodoOptimistic(!todoOptimistic.complete));

      await toggleTodo(todoOptimistic.id, !todoOptimistic.complete);
    } catch (error) {
      console.log(error);
      startTransition(() => toggleTodoOptimistic(!todoOptimistic.complete));
    }
  };

  return (
    <div
      className={todoOptimistic.complete ? styles.todoDone : styles.todoPending}
    >
      <div className="flex flex-col sm:flex-row justify-start items-center gap-4">
        <div
          onClick={onToggleTodo}
          className={`flex p-2 rounded-md cursor-pointer hover:bg-opacity-60 bg-blue-100`}
        >
          <IoCheckboxOutline size={30} />
        </div>

        <div className="text-center sm:text-left">
          {todoOptimistic.description}
        </div>
      </div>
    </div>
  );
};
