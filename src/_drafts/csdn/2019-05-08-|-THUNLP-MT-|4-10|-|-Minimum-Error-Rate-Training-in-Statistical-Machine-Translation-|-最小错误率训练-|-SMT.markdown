---
layout:  post
title:    "[ THUNLP-MT (4/10) ] Minimum Error Rate Training in Statistical Machine Translation | 最小错误率训练 + SMT"
date:   2019-05-08 23:12:53                    
author:  "tzuw"
header-img: "img/post-bg-2015.jpg"
catalog:   false
categories: 神经机器翻译 统计机器翻译
tags: [log-linear, Levenshtein distance]
---
本文介绍最小错误率训练方法，主要是笔者对于论文的理解，希望对你有帮助。  
该论文是THUNLP-MT推荐的机器翻译领域必读的十篇论文之一。 [ 论文传送门](http://aclweb.org/anthology/P03-1021)  
全文共分为论文内容和本文小结两部分。若有错误的地方，欢迎指出！

###  文章目录

  * 论文内容 
        * 统计机器翻译 之 log-linear模型 
        * 自动评测指标 
        * 最小错误率的训练目标 
        * 论文结论 
  * 本文小结 
  * 参考资料 

* * *

#  论文内容

作者Och
Josef在2003年提出了在当时统计机器翻译模型的问题：由于训练时多使用最大似然估计的方法，测试集上模型的输出往往没有较好的翻译质量。也因此，作者提出了根据任务需求的不同评价指标，以及一个根据翻译质量来训练模型的方法。

####  统计机器翻译 之 log-linear模型

使用log-linear模型对数据的后验概率建模。公式如下，其中：有  M  M  M  个特征，  λ  m  λ_m  λ  m  ​  是参数，  h
m  h_m  h  m  ​  是特征函数。通常特征函数的输出值都是0或者1。

p  λ  m  1  (  e  ∣  f  )  =  e  x  p  [  ∑  m  =  1  m  λ  m  h  m  (  e  ,
f  )  ]  ∑  e  ′  1  I  e  x  p  [  ∑  m  =  1  M  λ  m  h  m  (  e  ′  1  I
,  f  )  ]  p_{λ_m^1} (\bf{e} | \bf{f} )= \frac{exp[ \sum_{m=1}^m λ_m h_m (
\bf{e} , \bf{f} ) ]}{\sum_{e{\prime}_1^I} exp[ \sum_{m=1}^M λ_m h_m (
e{\prime}_1^I , \bf{f} ) ]}  p  λ  m  1  ​  ​  (  e  ∣  f  )  =  ∑  e  ′  1  I
​  ​  e  x  p  [  ∑  m  =  1  M  ​  λ  m  ​  h  m  ​  (  e  ′  1  I  ​  ,  f
)  ]  e  x  p  [  ∑  m  =  1  m  ​  λ  m  ​  h  m  ​  (  e  ,  f  )  ]  ​

####  自动评测指标

  * multi-reference word error rate (mWER)   
顾名思义，衡量的是输出翻译句子与多个参考的译文的错误率。使用Levenshtein distance 来作为衡量句子间距离的标准。

  * multi-reference position independent error rate (mPER)   
即无视句子中词语的出现顺序。

  * BLEU (bilingual evaluation understudy) score   
BLEU 分数的计算方式如下(1)式所示。其中，  c  c  c  表示系统译文，  c  ′  c^{&#x27;}  c  ′  表示参考译文
，N表示n-gram中的n，  p  n  p_n  p  n  ​  代表某个n-gram组成的集合在所有候选翻译句子中的出现概率，  B  P  (
⋅  )  BP(\cdot)  B  P  (  ⋅  )  则是长度惩罚系数。  
.  
C  o  u  n  t  c  l  i  p  Count_{clip}  C  o  u  n  t  c  l  i  p  ​
表示的是每个单词在所有参考译文中的出现次数的最大值（在下式中用maxReferenceCount表示），以及单词在模型输出译文中的出现次数，两个值中的最小值。这样子做是为了保证模型输出译文中每个单词的个数，不超过该单词在所有参考译文中出现次数的最大值。

(1)  BLEU  =  B  P  (  ⋅  )  ⋅  e  x  p  (  ∑  n  =  1  N  l  o  g  p  n  N  )
\text{BLEU} = BP(\cdot)\cdot exp ( \sum_{n=1}^N \frac{ log p_n}{N} ) \tag1
BLEU  =  B  P  (  ⋅  )  ⋅  e  x  p  (  n  =  1  ∑  N  ​  N  l  o  g  p  n  ​
​  )  (  1  )

(2)  p  n  =  ∑  c  ∈  C  a  n  d  i  d  a  t  e  ∑  n  −  g  r  a  m  ∈  c  C
o  u  n  t  c  l  i  p  (  n  −  g  r  a  m  )  ∑  c  ′  ∈  C  a  n  d  i  d
a  t  e  ∑  n  −  g  r  a  m  ′  ∈  c  ′  C  o  u  n  t  (  n  −  g  r  a  m
)  p_n = \frac{ \sum_{c∈Candidate} \sum_{n-gram∈c} Count_{clip}(n-gram) } {
\sum_{c^{&#x27;}∈Candidate} \sum_{n-gram^{&#x27;}∈c^{&#x27;}} Count(n-gram) }
\tag2  p  n  ​  =  ∑  c  ′  ∈  C  a  n  d  i  d  a  t  e  ​  ∑  n  −  g  r  a
m  ′  ∈  c  ′  ​  C  o  u  n  t  (  n  −  g  r  a  m  )  ∑  c  ∈  C  a  n  d
i  d  a  t  e  ​  ∑  n  −  g  r  a  m  ∈  c  ​  C  o  u  n  t  c  l  i  p  ​
(  n  −  g  r  a  m  )  ​  (  2  )

(3)  C  o  u  n  t  c  l  i  p  =  m  i  n  (  c  o  u  n  t  ,  m  a  x  R  e
f  e  r  e  n  c  e  C  o  u  n  t  )  Count_{clip} = min( count,
maxReferenceCount ) \tag3  C  o  u  n  t  c  l  i  p  ​  =  m  i  n  (  c  o
u  n  t  ,  m  a  x  R  e  f  e  r  e  n  c  e  C  o  u  n  t  )  (  3  )

  * NIST score   
NIST score是上面BLEU score的变种。主要修改了n-gram的权重计算方式，以及长度惩罚系数。（此处先不展开，有兴趣可以先看宗老师的书）

NIST  =  B  P  (  ⋅  )  ⋅  e  x  p  (  ∑  n  =  1  n  w  n  )  \text{NIST} =
BP(\cdot)\cdot exp ( \sum_{n=1}^n { w_n} )  NIST  =  B  P  (  ⋅  )  ⋅  e  x  p
(  n  =  1  ∑  n  ​  w  n  ​  )

####  最小错误率的训练目标

公式如下，训练的目标是得到包含最小的错误个数的句子。其中，  C  s  C_s  C  s  ​  表示候选模型输出句子，并且  ∣  C  s  ∣
=  K  |C_s|=K  ∣  C  s  ​  ∣  =  K  ，S则表示候选参考翻译句子的个数。(1)式中第一行  r  s  \bf{r_s}
r  s  ​  表示候选的参考翻译句子，  e  ^  \bf{\hat{e}}  e  ^
表示当前参数下的最优翻译句子，由(2)式中的最大值得到。(1)式中第二行，  δ  \delta  δ  是 [ Kronecker函数](http://zh.wikipedia.org/wiki/%E5%85%8B%E7%BD%97%E5%86%85%E5%85%8B%CE%B4%E5%87%BD%E6%95%B0)
，即若  e  ^  (  f  s  ;  λ  1  m  )  和  e  s  ,  k  \hat{e} (f_s;λ_1^m)和e_{s,k}
e  ^  (  f  s  ​  ;  λ  1  m  ​  )  和  e  s  ,  k  ​
两个字符串相等，则函数取值为1，否则为零。此处也表示的是在计算错误率时，只包括了K个候选句子中的拥有最大得分的句子。

(1)  λ  1  m  ^  =  argmin  ⁡  λ  1  m  {  ∑  s  =  1  S  E  (  r  s  ,  e  ^
(  f  s  ;  λ  1  m  )  )  }  =  argmin  ⁡  λ  1  m  ∑  s  =  1  S  ∑  k  =  1
K  E  (  r  s  ,  e  s  ,  k  )  δ  (  e  ^  (  f  s  ;  λ  1  m  )  ,  e  s
,  k  )  }  \begin{aligned} \hat{λ_1^m} &amp;= \underset{λ_1^m}{\operatorname{
argmin}} \\{ \sum_{s=1}^S E(\bf{r_s}, \hat{e}(f_s; λ_1^m) ) \\} \\\ &amp;=
\underset{λ_1^m}{\operatorname{argmin}}\sum_{s=1}^S\sum_{k=1}^K E(\bf{r_s},
e_{s,k} ) \delta ( \hat{e}(f_s; λ_1^m),e_{s,k} )\\} \tag1 \end{aligned}  λ  1
m  ​  ^  ​  ​  =  λ  1  m  ​  a  r  g  m  i  n  ​  {  s  =  1  ∑  S  ​  E  (
r  s  ​  ,  e  ^  (  f  s  ​  ;  λ  1  m  ​  )  )  }  =  λ  1  m  ​  a  r  g
m  i  n  ​  s  =  1  ∑  S  ​  k  =  1  ∑  K  ​  E  (  r  s  ​  ,  e  s  ,  k
​  )  δ  (  e  ^  (  f  s  ​  ;  λ  1  m  ​  )  ,  e  s  ,  k  ​  )  }  ​  (
1  )

(2)  e  ^  (  f  s  ;  λ  1  m  )  =  argmax  ⁡  e  ∈  C  s  {  ∑  m  =  1  M
λ  m  h  m  (  e  ∣  f  s  )  }  \hat{e}(f_s; λ_1^m)= \underset{e \in
C_s}{\operatorname{ argmax}} \\{ \sum_{m=1}^M {\lambda}_m
h_m(\bf{e}|\bf{f_s})\\} \tag2  e  ^  (  f  s  ​  ;  λ  1  m  ​  )  =  e  ∈  C
s  ​  a  r  g  m  a  x  ​  {  m  =  1  ∑  M  ​  λ  m  ​  h  m  ​  (  e  ∣  f
s  ​  )  }  (  2  )

特别的，由于(2)式中的最大化操作，和函数有很多局部最优点所导致优化目标不好处理，论文中也提到(1)式的平滑版本。

####  论文结论

该论文提出了log-linear模型在统计机器翻译模型中的两个新的优化目标：平滑的错误个数，不平滑的错误个数。并且对于不平滑的错误个数，该论文也提出了优化方法。经过试验该优化目标比MMI优化目标更能得到高质量的翻译结果。最后，作者也提出了两方面问题：

  * 若使用不平滑的最小错误率当做训练目标，多少参数能被有效地估计？经过平滑之后的变种最小错误率训练目标，是否能估计更多的参数？ 
  * 哪一个自动评测指标更代表了人类的评测结果？ 
    * 现在多数的机器翻译评测都是使用BLEU评价指标。 

* * *

#  本文小结

最小错误率训练目标的方法的提出时间较早，除了在统计机器学习上被使用，由于其能根据翻译评价指标来衡量模型的输出句子
，在现今的神经机器翻译模型中也常被使用来重新排序模型输出的n-best列表。

此外，最小错误率训练目标也有进一步的研究工作，如下：

  * [ Z-MERT: A Fully Configurable Open Source Tool for Minimum   
Error Rate Training of Machine Translation Systems ](http://www.mt-archive.info/PBML-2009-Zaidan.pdf) 2009

  * [ Minimum Error Rate Training by Sampling the Translation Lattice ](http://www.aclweb.org/anthology/D10-1059) 2010 
  * [ 基于集成学习的最小错误率训练算法 ](http://jxmu.xmu.edu.cn/oa/DArticle.aspx?type=view&id=20150626) 2015 

另一方面，如果想要实践，可以尝试统计机器翻译开源工具 [ Moses ](http://www.statmt.org/moses/) 。

#  参考资料

  1. Franz Josef Och. 2003. [ Minimum Error Rate Training in Statistical Machine Translation ](http://aclweb.org/anthology/P03-1021) . In _Proceedings of ACL 2003_ . ( [ Citation ](http://scholar.google.com/scholar?cites=15358949031331886708&as_sdt=2005&sciodt=0,5&hl=en) : 2,982) 
  2. 宗成庆《统计自然语言处理》 
  3. [ BLEU: a Method for Automatic Evaluation of Machine Translation ](http://www.aclweb.org/anthology/P02-1040.pdf)
  4. [ 最小错误率训练(mert)基本原理学习 ](http://blog.csdn.net/ict2014/article/details/25307019) 战辉 
  5. [ 最小错误率训练 ](http://blog.csdn.net/wangxinginnlp/article/details/8032343) warrioR_wx 
  6. [ Discriminative Training and Maximum Entropy Models for Statistical Machine Translation ](http://www.aclweb.org/anthology/P02-1038) 2002 [该篇论文的先前工作] 

