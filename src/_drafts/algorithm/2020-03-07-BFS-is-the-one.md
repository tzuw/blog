---
title: "宽度优先搜索-就是你了"
subtitle: "BFS, you are the one."
layout: post
author: "tzuw"
date: 2020-03-07 16:22:00
tags: [BFS, DFS, algorithm, 学习笔记]
categories: [算法]
---

BFS 的全名 Breadth-first Search，通常我在二叉树遍历的时候会用到它，又或者是在图的遍历中。（通常会用二维数组来表示图）

BFS 的关键是用到了队列这个数据结构。

在 BFS 中队列这个数据结构会经常被使用到，因为你在进行宽度优先搜索的时候需要决定优先去遍历哪些节点，于是你就需要挨个把他们放入队列中。另外，DFS（Depth-first Search），翻译做深度优先搜索。和 BFS 相对，在 DFS 中常用到的数据结构是队列 ( stack)，这是因为你在第一次经过这个节点时会需要把它记下，等到无路可走的时候在挨个回来找它们，看看还有没有什么其他的出路。

BFS 是一个性价比超高的算法，因为它很简单，但是你又会同时在简单的和困难的题目中遇到它。

### 數據結構 - 以遍历一个图为例

![numberOfIslands](/public/assets/img/in-post/bfs-example.png)



当然它其实应该长这样：

![numberOfIslands](/public/assets/img/in-post/bfs-example-1.png)



不对不对，上面那个邻接矩阵也可以，就是太图了。
邻接矩阵的耗费空间大，应考虑邻接矩阵，使用 HashMap 或者 HashSet。
应该用 map 比较好一点，在 Java 中应该用 HashMap 来表示一个图。

>   a -> [b, e], e -> [f], b -> [f], f -> [g, h], c -> [d, g] ，即每一条边都用一个对应关系来表示。



### BFS 的基本形式

正确的 BFS 是这个样子的：a — b — e — f — g — h — c — d 。

如果考虑层次遍历则是：[ [a, b, e] , [f, g, h] , [c, d] ]。

```java
public class Solution {
  public ArrayList<ArrayList<int>> bfs(HashMap<int, int> graph){
    if (graph == null) {
      return;
    }
    Queue queue = new LinkedList();
    queue.offer(graph.get(map.keySet().toArray()[0]));
    ArrayList<ArrayList<int>> result = new ArrayList<>(); //分层遍历与记录用
    Set<int> set = new HashSet<>();
    int c = 0;
    while (!queue.isEmpty()) {
      int qSize = queue.size();
      for (int c=0; c < qSize; c++) {
        int head = queue.poll();
        for (int i : graph.get(head)) {
          if (!set.contains(i)) {
            set.add(i);
            queue.offer(i);
            result[c].append(i);
          }
        }
      }
    }
    return result;
  }
}
```

**时间复杂度、时间复杂度、时间复杂度**：

其中，V 为点的个数，E 为边的个数。

-   以邻接矩阵 (相邻矩阵，adjacency matrix) 表示图时，时间复杂度为 O( V ^2 )。

    

-   以邻接链表 (相邻串列，adjacency list) 表示图时，时间复杂度为 O(V + E)。

    对于稀疏的图，边的个数和点的个数差不多，也就是 E = O(V)，那么 TIme Complexity = O (V)。

    对于稠密的图，边的个数远大于点的个数，也就是 E = O(V^2)，那么 TIme Complexity = O (E)。

DFS 的时间复杂度也是 



### 相关的题目

>   https://blog.csdn.net/g11d111/article/details/76169861

二叉树的分层遍历

Number of Islands

Word Ladder

Knight Shortest Path

### Number of Islands 

https://leetcode.com/problems/number-of-islands/

https://www.cnblogs.com/grandyang/p/4402656.html

Given a 2d grid map of `'1'`s (land) and `'0'`s (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

Example 1:

```
Input:
11110
11010
11000
00000

Output: 1
```

Example 2:

```
Input:
11000
11000
00100
00011

Output: 3
```

简而言之就是要找出岛屿的个数，准备使用的数据结构应该会是邻接矩阵了。( Java， int [ ] [ ] ) 

### 题解

这题用 DFS 和 BFS 都可以解。其中：

DFS：使用递归实现。首先两层 for 遍历邻接矩阵，将每个符合条件坐标的相邻位置，都利用递归实现深度优先搜索。

BFS：使用迭代实现。也是两层 for 遍历邻接矩阵，将每个符合条件坐标的相邻位置加入队列中，遍历直到队列为空即结束该层遍历。

```java
import java.util.Arrays;
import java.util.LinkedList;
import java.util.Queue;

public class NumOfIslands {
  // DFS 相邻矩阵 时间复杂度 O(m*n)
  public static int numberOfIslands_dfs(int[][] graph) {
    int res = 0;
    boolean[][] visited = new boolean[graph.length][graph[0].length];
    for (int i = 0; i < graph.length; i++) {
      for (int j = 0; j < graph[0].length; j++) {
        if (graph[i][j] == 0 || visited[i][j]) {
          continue;
        }
        dfs(graph, visited, i, j);
        res++;
      }
    }
    return res;
  }

  public static void dfs(int[][] graph, boolean[][] visited, int x, int y) {
    if (x < 0 || x >= graph.length || y < 0 || y >= graph[0].length
        || visited[x][y] || graph[x][y] == 0) {
      return;
    }
    visited[x][y] = true;
    dfs(graph, visited, x, y - 1); // 上
    dfs(graph, visited, x + 1, y); // 右
    dfs(graph, visited, x, y + 1); // 下
    dfs(graph, visited, x - 1, y); // 左
  }

  // BFS 相邻矩阵 时间复杂度 O(m*n)
  public static int numberOfIslands_bfs(int[][] graph) {
    int res = 0;
    int[] dx = {0, 0, 1, -1};
    int[] dy = {1, -1, 0, 0};
    Queue<Integer[]> queue = new LinkedList<>();
    for (int i = 0; i < graph.length; i++) {
      for (int j = 0; j < graph[0].length; j++) {
        if (graph[i][j] == 0) {
          continue;
        }
        queue.offer(new Integer[]{i, j});
        while (!queue.isEmpty()) {
          Integer[] ixy = queue.poll();
          int x = ixy[0];
          int y = ixy[1];
          for (int c = 0; c < 4; c++) {
            if (x + dx[c] >= 0 && x + dx[c] < graph.length 
                && y + dy[c] >= 0 && y + dy[c] < graph[0].length
                && graph[x + dx[c]][y + dy[c]] == 1) {
              queue.offer(new Integer[]{ixy[0] + dx[c], ixy[1] + dy[c]});
              graph[x + dx[c]][y + dy[c]] = 0;
            }
          }
        }
        res++;
      }
    }
    return res;
  }
  public static void main(String[] args) throws java.lang.Exception
  {
    int M[][] = new int[][] {
      { 1, 1, 0, 0, 0 },
      { 0, 1, 0, 0, 1 },
      { 1, 0, 0, 1, 1 },
      { 0, 0, 0, 0, 0 },
      { 1, 0, 1, 0, 1 } };
    // the copy of a 2d array in Java
    int M1[][] = Arrays.stream(M).map(int[]::clone).toArray(int[][]::new);;
    System.out.println("BFS, Number of islands is: " + numberOfIslands_bfs(M));
    System.out.println("DFS, Number of islands is: " + numberOfIslands_dfs(M1));
  }
}
```

### 运行结果

![numberOfIslands](/public/assets/img/in-post/numberOfIslands.png)

>   [https://leetcode.com/problems/number-of-islands/discuss/335686/the-space-complexity-of-bfs-solution](https://leetcode.com/problems/number-of-islands/discuss/335686/the-space-complexity-of-bfs-solution)

>   [https://stackoverflow.com/questions/50901203/dfs-and-bfs-time-and-space-complexities-of-number-of-islands-on-leetcode/50912382#50912382](https://stackoverflow.com/questions/50901203/dfs-and-bfs-time-and-space-complexities-of-number-of-islands-on-leetcode/50912382#50912382)

讨论了 NumOfIslands 的时间复杂度和空间复杂度：

NumOfIslands BFS/DFS 的空间复杂度的最坏情况 = Theta(N*M)

### 参考资料

1.  [https://www.jiuzhang.com/qa/?tag=bfs-dfs](https://www.jiuzhang.com/qa/?tag=bfs-dfs)
2.  [https://leetcode-cn.com/problems/binary-tree-level-order-traversal/solution/er-cha-shu-de-ceng-ci-bian-li-by-leetcode/](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/solution/er-cha-shu-de-ceng-ci-bian-li-by-leetcode/)
3.  [https://stomachache007.wordpress.com/2017/03/20/nc4-md/](https://stomachache007.wordpress.com/2017/03/20/nc4-md/) *
4.  [https://www.jiuzhang.com/qa/3311/](https://www.jiuzhang.com/qa/3311/)
5.  [https://www.jianshu.com/p/f50d0d09030e](https://www.jianshu.com/p/f50d0d09030e)
6.  [http://debussy.im.nuu.edu.tw/sjchen/Datastructure/98/course07.pdf](http://debussy.im.nuu.edu.tw/sjchen/Datastructure/98/course07.pdf)



---

[https://leetcode.com/problems/number-of-islands/discuss/515256/BFS-java-solution-maintain-the-state-of-the-grid-in-exchange-to-extra-memory.](https://leetcode.com/problems/number-of-islands/discuss/515256/BFS-java-solution-maintain-the-state-of-the-grid-in-exchange-to-extra-memory.)

[https://leetcode.com/problems/number-of-islands/discuss/509840/Comparison-of-Python-3-Solutions-using-DFS-and-BFS](https://leetcode.com/problems/number-of-islands/discuss/509840/Comparison-of-Python-3-Solutions-using-DFS-and-BFS)

[https://www.cnblogs.com/grandyang/p/4402656.html](https://www.cnblogs.com/grandyang/p/4402656.html)



