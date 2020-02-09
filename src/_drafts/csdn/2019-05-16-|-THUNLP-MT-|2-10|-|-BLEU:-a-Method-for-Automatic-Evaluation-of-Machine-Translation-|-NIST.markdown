---
layout:  post
title:    "[ THUNLP-MT (2/10) ] BLEU a Method for Automatic Evaluation of Machine Translation | NIST"
date:   2019-05-16 23:46:24                    
author:  "tzuw"
header-img: "img/post-bg-2015.jpg"
catalog:   false
tags: 自然語言處理 csdn

---
本文讨论BLEU评价指标的主要原理。原论文由IBM发表于ACL’02，是老生常谈的一篇论文了。BLEU指标如今经常在机器翻译任务的评价中使用。 (被引用
8924 次。)此外，本文还讨论BLEU的变种，NIST评价指标。

[ BLEU 原论文传送门 ](http://dl.acm.org/citation.cfm?id=1073135)  
BLEU: a Method for Automatic Evaluation of Machine Translation  
[ NIST 原论文传送门 ](http://www.mt-archive.info/HLT-2002-Doddington.pdf)  
Automatic Evaluation of Machine Translation Quality Using N-gram Co-Occurrence
Statistics

###  文章目录

    * 一个好的译文评分方法 
    * BLEU 主要原理 
    * NIST 
    * BLEU 最近的相关讨论 (2019.0515) 
    * 参考资料 

* * *

##  一个好的译文评分方法

应该同时具有敏感性和一致性两方面特性  
**》 敏感性**  
能够区分相似系统之间的好坏

**》一致性**  
不会因为不同的测试文本和参考译文而影响对系统性能的评价

##  BLEU 主要原理

**全名为：bilingual evaluation understudy，中文译为：双语互译质量评估辅助工具**

**》原理** : 机器翻译结果越接近专业人工翻译的结果，则越好。因此，考虑同现单元的计分。

(1)  BLEU  =  BP  ∗  e  x  p  (  ∑  n  =  1  N  w  n  ∗  log  p  n  )  # 累加
log  p  n  ,  等  于  log  ∏  n  =  1  N  p  n  ，  #  会  造  成  某  项  n  −  g  r
a  m  为  零  ，  整  个  BLEU  为  零  。  \begin{aligned} \text{BLEU} &amp;=
\text{BP}*exp(\sum_{n=1}^{N} w_n* \text{log } p_n) \tag1 \\\ &amp; \text{\\#
累加 log } p_n ,等于\text{ log } \prod_{n=1}^{N} p_n ， \\\ &amp; \text{\\#
}会造成某项n-gram为零，整个\text{BLEU} 为零。 \end{aligned}  BLEU  ​  =  BP  ∗  e  x  p  (
n  =  1  ∑  N  ​  w  n  ​  ∗  log  p  n  ​  )  #  累加  log  p  n  ​  ,  等  于
log  n  =  1  ∏  N  ​  p  n  ​  ，  #  会  造  成  某  项  n  −  g  r  a  m  为  零  ，
整  个  BLEU  为  零  。  ​  (  1  )

(2)  BP  =  {  1  ,  c  &gt;  r  e  (  1  −  r  /  c  )  ,  c  &lt;  =  r
\text{BP}=\left\\{ \begin{array}{rcl} 1 &amp; &amp; {,c &gt; r} \\\
e^{(1-r/c)} &amp; &amp; {,c &lt;= r} \\\ \end{array} \right. \tag2  BP  =  {
1  e  (  1  −  r  /  c  )  ​  ​  ,  c  > r  ,  c  < =  r  ​  (  2  )

(3)  p  n  =  ∑  C  ∈  {  C  a  n  d  i  d  a  t  e  }  ∑  n  −  g  r  a  m  ∈
C  C  o  u  n  t  c  l  i  p  (  n  −  g  r  a  m  )  ∑  C  ′  ∈  {  C  a  n
d  i  d  a  t  e  }  ∑  n  −  g  r  a  m  ′  ∈  C  ′  C  o  u  n  t  (  n  −
g  r  a  m  ′  )  #  Candidate 表示系统译文，Candidate means translated sentences
\begin{aligned} p_n &amp;= \frac{ \sum_{C∈{\\{Candidate\\}}} \sum_{n-gram∈C}
Count_{clip}(n-gram) } { \sum_{C^{&#x27;}∈\\{Candidate\\}}
\sum_{n-gram^{&#x27;}∈C^{&#x27;}} Count(n-gram&#x27;) } \tag3 \\\ &amp; \\#
\text{Candidate 表示系统译文，Candidate means translated sentences} \end{aligned}  p
n  ​  ​  =  ∑  C  ′  ∈  {  C  a  n  d  i  d  a  t  e  }  ​  ∑  n  −  g  r  a
m  ′  ∈  C  ′  ​  C  o  u  n  t  (  n  −  g  r  a  m  ′  )  ∑  C  ∈  {  C  a
n  d  i  d  a  t  e  }  ​  ∑  n  −  g  r  a  m  ∈  C  ​  C  o  u  n  t  c  l
i  p  ​  (  n  −  g  r  a  m  )  ​  #  Candidate  表示系统译文，  Candidate means
translated sentences  ​  (  3  )

(4)  C  o  u  n  t  c  l  i  p  =  m  i  n  (  c  o  u  n  t  ,  m  a  x  R  e
f  e  r  e  n  c  e  C  o  u  n  t  )  Count_{clip} = min( count,
maxReferenceCount ) \tag4  C  o  u  n  t  c  l  i  p  ​  =  m  i  n  (  c  o
u  n  t  ,  m  a  x  R  e  f  e  r  e  n  c  e  C  o  u  n  t  )  (  4  )

(5)  log BLEU  =  log BP  \+  ∑  n  =  1  N  w  n  ∗  log  p  n  =  m  i  n  (
1  −  r  c  ,  0  )  \+  ∑  n  =  1  N  w  n  ∗  log  p  n  \begin{aligned}
\text{log BLEU} &amp;= \text{log BP} + \sum_{n=1}^{N} w_n* \text{log}p_n \\\
&amp;= min(1-\frac{r}{c},0) + \sum_{n=1}^{N} w_n* \text{log}p_n \tag5
\end{aligned}  log BLEU  ​  =  log BP  \+  n  =  1  ∑  N  ​  w  n  ​  ∗  log
p  n  ​  =  m  i  n  (  1  −  c  r  ​  ,  0  )  \+  n  =  1  ∑  N  ​  w  n  ​
∗  log  p  n  ​  ​  (  5  )

(1) 中，  BP  \text{BP}  BP  表示  brevity penalty  \text{brevity penalty}
brevity penalty  ，即长度惩罚因子。  p  n  p_n  p  n  ​  表示整个测试文本的准确度积分（Corpus-based
N-gram Precision），一般N=4，且  w  n  w_n  w  n  ​  =1/N。

(2) 表示的是，某个n-gram组成的集合在所有候选翻译句子中的出现概率，即同现单元的计分方法。其中，c 和 r
分别表示候选译文的长度和参考译文长度。当候选译文长度大于参考译文，  BP  =  1  \text{BP}=1  BP  =  1
，当候选译文长度小于等于参考译文长度，  BP  &lt;  1  \text{BP}&lt;1  BP  < 1  。即偏向较长的候选译文。

(3) 表示的是累积所有翻译句子修正后的 N-gram 计数，除上测试集中所有句子的 N-gram 计数。 ** C  C  C  和  C  ′
C^{&#x27;}  C  ′  都表示系统译文，而分子表示的是系统译文出现在任何参考译文中的个数；分母表示的是系统译文的各个n-gram的计数加和 **
。

(4) 表示修正后的 N-gram
计数的计算方式。即是每个单词在所有参考译文中的出现次数的最大值（在下式中用maxReferenceCount表示），以及单词在模型输出译文中的出现次数，两个值中的最小值。

(5) 表示取对数后的 BLEU 评价指标。

> **举例而言，** “猫咪在垫子上。”  
>  系统译文：the the the the the the the.  
>  参考译文1：The cat is on the mat.  
>  参考译文1：There is a cat on the mat.  
>  N  =  2  N=2  N  =  2  （一般N=4）

> 当  n  =  1  n=1  n  =  1  时，  
>  未修正的测试文本准确度：  
>  p  1  =  ∑  C  ∈  {  C  a  n  d  i  d  a  t  e  }  ∑  1  −  g  r  a  m  ∈
C  C  o  u  n  t  (  1  −  g  r  a  m  )  ∑  C  ′  ∈  {  C  a  n  d  i  d  a
t  e  }  ∑  1  −  g  r  a  m  ′  ∈  C  ′  C  o  u  n  t  (  1  −  g  r  a  m
′  )  =  7  7  =  1  \begin{aligned} p_1 &amp;= \frac{
\sum_{C∈\\{Candidate\\}} \sum_{1-gram∈C} Count(1-gram) } {
\sum_{C^{&#x27;}∈\\{Candidate\\}} \sum_{1-gram^{&#x27;}∈C^{&#x27;}}
Count(1-gram&#x27;) } \\\ &amp;= \frac{7}{7} = 1 \end{aligned}  p  1  ​  ​  =
∑  C  ′  ∈  {  C  a  n  d  i  d  a  t  e  }  ​  ∑  1  −  g  r  a  m  ′  ∈  C
′  ​  C  o  u  n  t  (  1  −  g  r  a  m  ′  )  ∑  C  ∈  {  C  a  n  d  i  d
a  t  e  }  ​  ∑  1  −  g  r  a  m  ∈  C  ​  C  o  u  n  t  (  1  −  g  r  a
m  )  ​  =  7  7  ​  =  1  ​  
>  .  
>  修正的测试文本准确度：（即避免系统译文中n-gram的个数，大于其在某个参考译文中出现的个数）  
>  C  o  u  n  t  c  l  i  p  =  m  i  n  (  c  o  u  n  t  ,  m  a  x  R  e
f  e  r  e  n  c  e  C  o  u  n  t  )  =  m  i  n  (  7  ,  2  )  =  2
\begin{aligned} Count_{clip} &amp;= min( count, maxReferenceCount ) \\\ &amp;=
min( 7, 2 ) \\\ &amp;= 2 \end{aligned}  C  o  u  n  t  c  l  i  p  ​  ​  =  m
i  n  (  c  o  u  n  t  ,  m  a  x  R  e  f  e  r  e  n  c  e  C  o  u  n  t
)  =  m  i  n  (  7  ,  2  )  =  2  ​  
>  .

> 当  n  =  2  n=2  n  =  2  时，  
>  未修正的测试文本准确度：  
>  p  2  =  0  6  =  0  \begin{aligned} p_2 &amp;= \frac{ 0 } { 6 } \\\ &amp;=
0 \end{aligned}  p  2  ​  ​  =  6  0  ​  =  0  ​  
>  .  
>  修正的测试文本准确度：（即避免系统译文中n-gram的个数，大于其在某个参考译文中出现的个数  
>  C  o  u  n  t  c  l  i  p  =  m  i  n  (  c  o  u  n  t  ,  m  a  x  R  e
f  e  r  e  n  c  e  C  o  u  n  t  )  =  m  i  n  (  6  ,  0  )  =  0
\begin{aligned} Count_{clip} &amp;= min( count, maxReferenceCount ) \\\ &amp;=
min( 6, 0 ) \\\ &amp;= 0 \end{aligned}  C  o  u  n  t  c  l  i  p  ​  ​  =  m
i  n  (  c  o  u  n  t  ,  m  a  x  R  e  f  e  r  e  n  c  e  C  o  u  n  t
)  =  m  i  n  (  6  ,  0  )  =  0  ​

>

> c  =  7  ，  r  =  7  c=7，r=7  c  =  7  ，  r  =  7  （选取长度最接近的参考翻译，若存在多个则取最小的）  
>  .  
>  BP  =  e  (  1  −  r  /  c  )  （  c  &lt;  =  r  ）  =  1  \begin{aligned}
\text{BP} &amp;= e^{(1-r/c)} &amp; &amp; {（c &lt;= r）} \\\ &amp;= 1
\end{aligned}  BP  ​  =  e  (  1  −  r  /  c  )  =  1  ​  （  c  < =  r  ）  
>  .  
>  p  2  =  6  0  =  0  # 警告:除以零  \begin{aligned} p_2 &amp;= \frac{6}{0} = 0
\text{\\# 警告:除以零} \end{aligned}  p  2  ​  ​  =  0  6  ​  =  0  #  警告  :  除以零
​  
>  .  
>  BLEU  =  BP  ∗  e  x  p  (  ∑  n  =  1  2  w  n  ∗  log  p  n  )  =  BP  ∗
e  x  p  (  ∑  n  =  1  2  1  2  ∗  l  o  g  p  n  )  =  BP  ∗  e  x  p  (  1
2  ∗  l  o  g  (  2  /  7  )  \+  1  2  ∗  l  o  g  (  0  )  )  #
警告:除以零，解决：在源代码里返回了0  =  BP  ∗  e  x  p  (  1  2  ∗  l  o  g  (  2  /  7  )  )
=  e  x  p  (  1  2  ∗  l  o  g  (  2  /  7  )  )  =  e  x  p  (  1  2  )  ∗
2  7  =  0.471  \begin{aligned} \text{BLEU} &amp;=
\text{BP}*exp(\sum_{n=1}^{2} w_n* \text{log} p_n) \\\ &amp;=
\text{BP}*exp(\sum_{n=1}^{2} \frac{1}{2}*log p_n) \\\ &amp;= \text{BP}*exp(
\frac{1}{2}*log(2/7) + \frac{1}{2}*log(0)) \text{\\# 警告:除以零，解决：在源代码里返回了0} \\\
&amp;= \text{BP}*exp( \frac{1}{2}*log(2/7)) \\\ &amp;= exp(
\frac{1}{2}*log(2/7)) = exp(\frac{1}{2}) * \frac{2}{7}=0.471 \end{aligned}
BLEU  ​  =  BP  ∗  e  x  p  (  n  =  1  ∑  2  ​  w  n  ​  ∗  log  p  n  ​  )
=  BP  ∗  e  x  p  (  n  =  1  ∑  2  ​  2  1  ​  ∗  l  o  g  p  n  ​  )  =  BP
∗  e  x  p  (  2  1  ​  ∗  l  o  g  (  2  /  7  )  \+  2  1  ​  ∗  l  o  g  (
0  )  )  #  警告  :  除以零，解决：在源代码里返回了  0  =  BP  ∗  e  x  p  (  2  1  ​  ∗  l  o
g  (  2  /  7  )  )  =  e  x  p  (  2  1  ​  ∗  l  o  g  (  2  /  7  )  )  =
e  x  p  (  2  1  ​  )  ∗  7  2  ​  =  0  .  4  7  1  ​

##  NIST

NIST - National Institute of standards and Technology

**》同现概率的几何平均 (=对数加权平均) 换成算术平均**  
对各阶 n-gram 同现单元的得分，取算术平均值。（原来 BLEU 是取加权平均）

**》长度惩罚因子变种**

Score  =  ∑  n  =  1  N  {  ∑  所  有  同  现  的  w  1  .  .  .  w  n  Info  (  w
1  .  .  .  w  n  )  ∑  系  统  译  文  中  所  有  w  1  .  .  .  w  n  (  1  )  }
⋅  exp  ⁡  {  β  log  ⁡  2  [  m  i  n  (  L  s  y  s  L  r  e  f  ‾  ,  1  )]  }  \text{Score} = \sum_{n=1}^N \\{ \frac {\sum_{所有同现的 \ w_1...w_n}
\text{Info}(w_1...w_n) } {\sum_{系统译文中所有\ w_1...w_n } (1) } \\} · \exp \\{
\beta \log^2 [ min( \frac{L_{sys}}{\overline{L_{ref}}}, 1 ) ] \\} \  Score  =
n  =  1  ∑  N  ​  {  ∑  系  统  译  文  中  所  有  w  1  ​  .  .  .  w  n  ​  ​  (
1  )  ∑  所  有  同  现  的  w  1  ​  .  .  .  w  n  ​  ​  Info  (  w  1  ​  .  .
.  w  n  ​  )  ​  }  ⋅  exp  {  β  lo  g  2  [  m  i  n  (  L  r  e  f  ​  ​
L  s  y  s  ​  ​  ,  1  )  ]  }

Info  (  w  1  .  .  .  w  n  )  =  log  ⁡  Num of  o  c  c  u  r  r  e  n  c
e  s  o  f  w  1  .  .  .  w  n  −  1  Num of  o  c  c  u  r  r  e  n  c  e  s
o  f  w  1  .  .  .  w  n  \text{Info}(w_1...w_n) = \log \frac{\text{Num of }
occurrences\ of\ w_1...w_{n-1}}{\text{Num of} \ occurrences\ of\ w_1...w_{n}}
Info  (  w  1  ​  .  .  .  w  n  ​  )  =  lo  g  Num of  o  c  c  u  r  r  e
n  c  e  s  o  f  w  1  ​  .  .  .  w  n  ​  Num of  o  c  c  u  r  r  e  n  c
e  s  o  f  w  1  ​  .  .  .  w  n  −  1  ​  ​

> To do this we used the F-ratio measure, namely the between-system  
>  score variance divided by within-system score variance.  
>  .  
>  F-ratios 表示的是，不同系统间的得分偏差，除以某一系统本身的得分偏差。  
>  the superior F-ratios of information-weighted counts and the comparable
correlations

> 计算工具 [ [ link ](http://www.nist.gov/itl/iad/mig/tools) ] [ [ 使用介绍](%E6%9C%BA%E5%99%A8%E7%BF%BB%E8%AF%91%E8%AF%84%E6%B5%8B%E2%80%94%E2%80%94BLEU%E6%94%B9%E8%BF%9B%E5%90%8E%E7%9A%84NIST%E7%AE%97%E6%B3%95)]

##  BLEU 最近的相关讨论 (2019.0515)

[ Blend: a Novel Combined MT Metric Based on Direct Assessment - CASICT-DCU
submission to WMT17 Metrics Task](http://www.semanticscholar.org/paper/Blend:-a-Novel-Combined-MT-Metric-Based-on-Direct-Ma-Graham/ac96104f106aa89c7b4dfe5b898dd375a835cfc9) |
Qingsong, WMT’2017

[ BLEU is Not Suitable for the Evaluation of Text Simplification](http://aclweb.org/anthology/D18-1081) | EMNLP 2018 (Short papers)

[ Metric for Automatic Machine Translation Evaluation based on Universal
Sentence Representations ](http://arxiv.org/abs/1805.07469) | NAACL 2018
Student Research Workshop

[ Metric for Automatic Machine Translation Evaluation based on Universal
Sentence Representations ](http://www.semanticscholar.org/paper/Metric-for-Automatic-Machine-Translation-Evaluation-Shimanaka-Kajiwara/497107226bc308af8ffad47f58a6918cd8970dc3) | Hiroki, NAACL-HLT’2018

[ RUSE: Regressor Using Sentence Embeddings for Automatic Machine Translation
Evaluation ](http://www.semanticscholar.org/paper/RUSE:-Regressor-Using-Sentence-Embeddings-for-Shimanaka-Kajiwara/96439189912ac24a4460c50d753fa187b4a0406a) | Hiroki, WMT’2018

[ BERTScore: Evaluating Text Generation with BERT](http://www.semanticscholar.org/paper/BERTScore:-Evaluating-Text-Generation-with-BERT-Zhang-Kishore/295065d942abca0711300b2b4c39829551060578) | Tianyi
Zhang, [ github ](http://github.com/Tiiiger/bert_score) , 2019

##  参考资料

  * 《统计自然语言处理》宗成庆 
  * [ wiki BLEU ](http://en.wikipedia.org/wiki/BLEU)
  * [ Overview of BLEU ](http://www.cs.cmu.edu/~archan/coursework/Original_BLEU_V4.ppt) | Arthur Chan 
  * [ 机器翻译质量评测算法-BLEU ](http://blog.csdn.net/wwj_748/article/details/79686042#commentBox) | IT_xiao小巫 
  * [ 浅谈用Python计算文本BLEU分数 ](http://cloud.tencent.com/developer/article/1042161) | 腾讯云社区 
  * [ 机器翻译评价指标之BLEU详细计算过程 ](http://blog.csdn.net/guolindonggld/article/details/56966200) * | 加勒比海鲜 | [ nltk.align.bleu_score ](http://www.nltk.org/_modules/nltk/align/bleu_score.html)
  * [ 机器翻译自动评估-BLEU算法详解 ](http://blog.csdn.net/qq_31584157/article/details/77709454) | Big_Din 
  * [ 论文阅读：《BLEU: a Method for Automatic Evaluation of Machine Translation》 ](http://blog.csdn.net/u011239443/article/details/80527243) | 卓寿杰_SoulJoy 

* * *

_修养 修行 涵养_

