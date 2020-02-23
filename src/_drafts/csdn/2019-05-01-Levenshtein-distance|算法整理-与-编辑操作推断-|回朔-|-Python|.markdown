---
layout:  post
title:    "Levenshtein distance：算法整理 与 编辑操作推断 【回朔 + Python】"
date:   2019-05-01 23:55:00                    
author:  "tzuw"
header-img: "img/post-bg-2015.jpg"
catalog:   false
tags: [levenshtein distance, 动态规划, csdn]

---
本文讨论通过Levenshtein distance和单源最短路径搜索算法来推断两个字符串（句子）之间最佳的编辑操作序列。使用到的知识有：动态规划 和
单源最短路径搜索算法。

> Levenshtein distance（也叫做编辑距离，Edit distance）由Vladimir
Levenshtein在1965年提出，主要用来比较两个字符串之间的编辑距离，可以延伸到衡量两个字符串之间的相似度。

* * *

**目录**

动态规划的思想

进一步 ：Levenshtein distance 算法之优化

最短路径搜索 Bellman–Ford && Dijkstra

例子：语法错误修正的参考结果

主要应用场景

参考资料

* * *

* * *

##  动态规划的思想

对于两个字符串 s, t ， s[1..i] 表示字符串 s 的子串。 d[ i , j ] 用来表示表示将串s[ 1…i ] 转换为 串t [ 1…j]所需要的最少步骤个数，它可以使用一个二维数组保存。  

  * 在 i=0 时，也就是说字符串 s 为空。那么对应的 d[0,j] 就是 增加 j 个字符，使得字符串 s 转化为字符串 t； 
  * 在 j=0 时，也就是说字符串  t为空。那么对应的 d[i,0] 就是 减少 i 个字符，使得字符串 s 转化为字符串 t； 
  * 即 d[0,j]=j , d[i,0]=i 

考虑一般情况，即得到将 s[1..i] 经过最少次数的增加，删除，或者替换编辑操作转变为 t[1..j]
的操作个数，那么就必须在之前的步骤中以最少的次数来进行编辑操作，使得当前的字符串只需要再做一次操作或者不做就可以完成转换。  
  
之前的步骤可以分为三种情况：

  1. 在 k 个编辑操作内将 s[1…i] 转换为 t[1…j-1] 
  2. 在 k 个编辑操作内将 s[1..i-1] 转换为 t[1..j] 
  3. 在 k 个编辑操作内将 s[1…i-1] 转换为 t [1…j-1] 

对于第1种情况，只需要在最后将 t[j] 加上 s[1..i] 就完成了匹配，这样总共就需要 k+1 个操作。  
对于第2种情况，只需要在最后将 s[i] 移除，然后再做这 k 个操作，所以总共需要 k+1 个操作。  
对于第3种情况，只需要在最后将 s[i] 替换为 t[j]，使得满足 s[1..i] == t[1..j] ，这样总共也需要 k+1个操作。

而如果在第3种情况下，s[i] 刚好等于 t[j]，那我们就可以仅仅使用 k
个操作就完成这个过程。最后，为了保证得到的操作次数总是最少的，需要从上面三种情况中选个数最少的一种编辑操作，作为当前将 s[1..i ] 转换为
t[1..j] 所需要的操作次数。

可以整理为如下公式：

![](http://img-blog.csdnimg.cn/2019050222132770.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMzMzg3MDY4,size_16,color_FFFFFF,t_70)

具体的实现：通过动态规划建立 distance矩阵 和 backpointer字典，代码如下。

    
    
    # reference: m2scorer
    # 时间复杂度 O(len(s1)*len(s2))
    def levenshtein_matrix(s1, s2, cost_ins=1, cost_del=1, cost_sub=2):
        if len(second) == 0 or len(second) == 0:
            return len(first) + len(second)
    
        s1_length = len(s1) + 1
        s2_length = len(s2) + 1
    
        # 初始化
        distance_matrix = [[None] * s2_length for x in range(s1_length)]
        backpointers = {}
        distance_matrix[0][0] = 0
        for i in range(1, s1_length):
            distance_matrix[i][0] = i
            edit = ("del", i-1, i, s1[i-1], '', 0)
            backpointers[(i, 0)] = [((i-1,0), edit)]
        for j in range(1, s2_length):
            distance_matrix[0][j]=j
            edit = ("ins", 0, 0, '', s2[j-1], 0) # always insert from the beginning
            #edit = ("ins", j-1, j-1, '', s2[j-1], 0)
            backpointers[(0, j)] = [((0,j-1), edit)]
    
        # 动态规划
        for i in range(1, s1_length):
            for j in range(1, s2_length):
                deletion = distance_matrix[i-1][j] + cost_del
                insertion = distance_matrix[i][j-1] + cost_ins
                if s1[i-1] == s2[j-1]:
                    substitution = distance_matrix[i-1][j-1]
                else:
                    substitution = distance_matrix[i-1][j-1] + cost_sub
                if substitution == min(substitution, deletion, insertion):
                    distance_matrix[i][j] = substitution
                    if s1[i-1] != s2[j-1]:
                        edit = ("sub", i-1, i, s1[i-1], s2[j-1], 0)
                    else:
                        edit = ("noop", i-1, i, s1[i-1], s2[j-1], 1)
                    try:
                        backpointers[(i, j)].append(((i-1,j-1), edit))
                    except KeyError:
                        backpointers[(i, j)] = [((i-1,j-1), edit)]
                if deletion == min(substitution, deletion, insertion):
                    distance_matrix[i][j] = deletion
                    edit = ("del", i-1, i, s1[i-1], '', 0)
                    try:
                        backpointers[(i, j)].append(((i-1,j), edit))
                    except KeyError:
                        backpointers[(i, j)] = [((i-1,j), edit)]
                if insertion == min(substitution, deletion, insertion):
                    distance_matrix[i][j] = insertion
                    edit = ("ins", i, i, '', s2[j-1], 0)
                    try:
                        backpointers[(i, j)].append(((i,j-1), edit))
                    except KeyError:
                        backpointers[(i, j)] = [((i,j-1), edit)]
        return (distance_matrix, backpointers)

##  进一步 ：Levenshtein distance 算法之优化

原本的时间复杂度为O(len(s1)*len(s2)，空间复杂度O(len(s1)*len(s2)，太大了！

降低空间复杂度  O(2∗max{M, N}) [ BlackStorm ](http://home.cnblogs.com/u/BlackStorm/)

降低时间复杂度  O(n +d^2)

  * [ Levenshtein Distance Algorithm better than O(n*m)? ](http://stackoverflow.com/questions/4057513/levenshtein-distance-algorithm-better-than-onm) (stackoverflow) 
    * Time Warps, String Edits, and Macromolecules: The Theory and Practice of Sequence Comparison | Joseph B. Kruskal 
      * [ http://languagelog.ldc.upenn.edu/myl/KruskalLiberman1983.pdf ](http://languagelog.ldc.upenn.edu/myl/KruskalLiberman1983.pdf)
    * An Overview of Sequence Comparison: Time Warps, String Edits, and Macromolecules | Joseph B. Kruskal 
    * [ Algorithm for Approximate String Matching ](http://www.cs.helsinki.fi/u/ukkonen/InfCont85.PDF) | ESKO UKKONEN 
  * [ 一个快速、高效的Levenshtein算法实现 ](http://www.cnblogs.com/ymind/archive/2012/03/27/fast-memory-efficient-Levenshtein-algorithm.html#undefined) 老陈的博客 
  * [ Levenshtein Distance, in Three Flavors ](http://people.cs.pitt.edu/~kirk/cs1501/Pruhs/Spring2006/assignments/editdistance/Levenshtein%20Distance.htm) | [ Michael Gilleland ](http://www.merriampark.com/mgresume.htm) , [ Merriam Park Software ](http://www.merriampark.com/index.htm)

##  最短路径搜索 Bellman–Ford && Dijkstra

Bellman–Ford算法  O(VE) | Dijkstra 算法  O(ElogV)

这部分需要在 backpointer字典 构成的有向图中找到从源点 (0,0) 到 终点 (len(s),len(t)) 的最短路径。并且考虑效率，
_和未来如果有金标的编辑操作需要用到负权重的边_ ，这里选择使用两种最短路径搜索算法供选择。分别是支持负权重边的 Bellman–Ford算法，和效率较高的
Dijkstra算法 。为了得到编辑操作序列，在两个算法的最后从结尾节点往原节点遍历。

    
    
    # 时间复杂度：O(VE) ； 空间复杂度：O(E)
    def bellmanFord(V, E, dist, edits):
    
        thisdist = {}
        path = {}
    
        for v in V:
            thisdist[v] = float('inf')
        thisdist[(0,0)] = 0 # start = (0,0)
    
        for i in range(len(V)-1): 
            for edge in E:
                v = edge[0]
                w = edge[1]
                if thisdist[v] + dist[edge] < thisdist[w]:
                    thisdist[w] = thisdist[v] + dist[edge]
                    path[w] = v
        
        v = sorted(V)[-1] # 从最后一个节点开始回朔
        editSeq = []
        while True:
            try:
                w = path[v]
            except KeyError:
                break
            edit = edits[(w,v)]
            if edit[0] != 'noop':
                editSeq.append((edit[0],edit[1], edit[2], edit[3], edit[4]))
            v = w
        return editSeq
    
    # 使用最小堆，时间复杂度：O(ElogV) ； 空间复杂度：O(V)
    # 使用了 最小堆（heap）数据结构，父节点用于小于节点
    # heappush
    # heappop
    def dijkstra(V, E, dist, edits)):
        """
        # 原点开始 (0,0)
        """
    
        E1 = defaultdict(list)
        for e in E:
            E1[e[0]].apppend(e[1])
    
        start=(0,0)
        path = {}
        distance = {}
        for v in V:
            distance[v] = float('inf')
        distance[(0,0)] = 0   
    
        # 标记是否访问过
        visited = dict((key,False) for key in G)   
    
        # 存放排序后的 原点 到 各个节点的 距离 【 vertex-based 】
        pq = [] 
        my_hp.heappush(pq, [distance[start], start])
     
        # 记录到每个点的路径
        path = dict((vertex,[start]) for vertex in V)   
    
        while len(pq)>0: 
    
            # pop 头结点
            v_distance, v = my_hp.heappop(pq) # O( V * log(V) )
    
            if visited[v] == True:
                continue
            visited[v] = True
    
            # 到v的最短路径
            p = path[v].copy()   
    
            for node in E1[v]: # 与v直接相连的点
    
                new_distance = distance[v] + dist.get((v, node), float('inf'))
    
                # O( E * log(V) )
                # 对应算法导论中的 RELAX 方法
                # 如果与 node 直接相连的点，通过 node 到起始点的距离小于 distance字典中对应的值，则用小的值替换
                if new_distance < distance[node] and (not visited[node]): # O(E)
                    
                    distance[node] = new_distance           
    
                    my_hp.heappush(pq,[distance[node],node]) # push O(logV)
    
                    # 更新node的路径
                    # temp = p.copy()
                    # temp.append(node)   
                    # path[node] = temp   
                    path[node] = v
    
        v = sorted(V)[-1] # 从最后一个节点开始回朔
        editSeq = []
        while True:
            try:
                w = path[v]
            except KeyError:
                break
            edit = edits[(w,v)]
            if edit[0] != 'noop':
                editSeq.append((edit[0],edit[1], edit[2], edit[3], edit[4]))
            v = w
        return editSeq
    

* * *

##  
例子：语法错误修正的参考结果

举例而言，对于两个句子，

> （1） “你不觉得中文很好趣的说”  
>  （2） “我觉得中文很有趣”

需要将句子（1）修正为句子（2），它们之间的编辑操作序列可以通过如下步骤得到：

1\. 通过动态规划建立 distance矩阵和 backpointer矩阵  
矩阵如下面两图。其中，图一是 distance矩阵，图二是 部分
backpointer字典的输出，其中curr表示当前节点，before表示前一个节点，即构成了一个边，并且记录了原字符串需要进行的编辑操作类型和位置。实现方式是，通过两个回圈遍历字符串，比较前面提到的3种情况来得到两个矩阵。其中，backpointer矩阵包含了上一个节点，即构成了一个图。

![](http://img-blog.csdnimg.cn/20190501234555740.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMzMzg3MDY4,size_16,color_FFFFFF,t_70)
![](http://img-blog.csdnimg.cn/20190501234642106.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMzMzg3MDY4,size_16,color_FFFFFF,t_70)

2\. 使用 Bellman–Ford算法来搜寻 backpointer字典 构成的图，建立编辑距离图和编辑操作图。  
![](http://img-blog.csdnimg.cn/2019050123481147.png) ![](http://img-blog.csdnimg.cn/20190501234845807.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMzMzg3MDY4,size_16,color_FFFFFF,t_70)

  
最后，通过回朔得到输出结果：

![](http://img-blog.csdnimg.cn/20190501234913349.png)

##  
主要应用场景

  * **语法错误修正**

使用单源最短路径算法的回朔输出结果可以作为语法错误修正的参考结果。

  * **拼字纠错**

1\. [ 命令行和搜索引擎等的关键词错误纠正（Did you mean...？）是如何实现的？](http://www.zhihu.com/question/24675366) （知乎）

[ 陈运文 ](http://www.zhihu.com/people/chenyunwen)
提到：在中文中由于使用拼音输入法作为输入，往往不会出现错字的情况；然而，中文的语义单元多由两个或以上的汉字组成，如此就有可能会产生别字，即拼字错误。具体的方法有两种：编辑距离
和 噪声信道模型 ( Noisy channel model )。

2\. liuhuanyong/ [ QueryCorrection](http://github.com/liuhuanyong/QueryCorrection) 基于拼音相似度与编辑距离的查询纠错 ( github
开源 )

  * **字符串相似度计算**

**1.** _**[ Properties of Levenshtein, N-Gram, cosine and Jaccard distance
coefficients - in sentence matching](http://stats.stackexchange.com/questions/219243/properties-of-levenshtein-n
-gram-cosine-and-jaccard-distance-coefficients-in) ** _ **** (stack exchange)

[ ttnphns ](http://stats.stackexchange.com/users/3277/ttnphns) 提到：Levenshtein
is a specific form of "alignment" distance, and it compares sequences of
elements, i.e. both content of elements and their order. Cosine and Jaccard
compare only content (element is, say, a letter). Bi-gram distance compares
content of elements, but an element is defined specifically as 2-letter chunk.
– ttnphns Jun 21 '16 at 9:52

具体而言，Levenshtein distance 算法既衡量了两字符串之间的内容差异，又考虑了其子串之间的位置关系。而 Cosine similarity
和 Jaccard similarity 则只衡量了两字符串之间的内容差异。

**2. _[ Compare similarity algorithms](http://stackoverflow.com/questions/9842188/compare-similarity-algorithms) _
** (stackoverflow)

[ MrGomez ](http://stackoverflow.com/users/517815/mrgomez)
提到：不同的相似度度量解决了不同的问题，而被用在不同的场景中。并且也提到了，距离相似度需要满足 [ 三角不等式](http://zh.wikipedia.org/wiki/%E4%B8%89%E8%A7%92%E4%B8%8D%E7%AD%89%E5%BC%8F)
。

**3. _[ String similarity -> Levenshtein distance](http://stackoverflow.com/questions/11675034/string-similarity-levenshtein-distance) _ ** (stackoverflow)

**4. _[ Similarity String Comparison in Java](http://stackoverflow.com/questions/955110/similarity-string-comparison-in-java?noredirect=1&lq=1) _ ** (stackoverflow)

  * **数据对齐**

数据对齐是对字符串相似度计算方法的应用。具体的场景有query查询。

##  参考资料

  1. [ 经典算法研究系列：二、Dijkstra 算法初探 ](http://blog.csdn.net/v_JULY_v/article/details/6096981) v_JULY_v 
  2. [ “生动”讲解——深度优先搜索与广度优先搜索 ](http://blog.csdn.net/a396901990/article/details/45028741)
  3. [ heapq — Heap queue algorithm ](http://docs.python.org/2/library/heapq.html)
  4. [ heapq.md 使用方式 ](http://github.com/qiwsir/algorithm/blob/master/heapq.md)
  5. [ 字符串编辑距离（Levenshtein距离）算法 ](http://www.cnblogs.com/BlackStorm/p/5400809.html)
  6. [ Levenshtein Distance and Text Similarity in Python ](http://stackabuse.com/levenshtein-distance-and-text-similarity-in-python/)
  7. [ 数据对齐-编辑距离算法详解（Levenshtein distance） ](http://blog.csdn.net/CSDN___LYY/article/details/85009190#2_51)
  8. [ Levenshtein Distance: Inferring the edit operations from the matrix ](http://stackoverflow.com/questions/5849139/levenshtein-distance-inferring-the-edit-operations-from-the-matrix)   

  

