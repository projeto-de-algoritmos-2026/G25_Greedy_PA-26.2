/**
 * Uma tarefa que a pessoa quer encaixar no dia.
 * - minutes: duração da tarefa (peso na mochila)
 * - priority: urgência de 1 a 10 (valor na mochila)
 */
export interface Task {
  id: string;
  name: string;
  minutes: number;
  priority: number;
}

/** Quanto de cada tarefa entrou na solução final. */
export interface Allocation {
  taskId: string;
  /** 1 = tarefa inteira, entre 0 e 1 = parte da tarefa */
  fraction: number;
  minutes: number;
  value: number;
}
