---
layout:  post
title:    "[ THUNLP-MT (6/10) ] Sequence to Sequence Learning with Neural Networks | seq2seq模型"
date:   2019-05-19 20:39:42                    
author:  "tzuw"
header-img: "img/post-bg-2015.jpg"
catalog:   false
tags: seq2seq csdn
categories: [神经机器翻译, NLP]

---
本文介绍NLP领域重要的seq2seq模型，包含了模型的基本原理和 Sutskever
等人研究工作中的相关实验。有不对的地方欢迎指出，一起学习呀。明天可就是520了。

[ 论文传送门 ](http://arxiv.org/abs/1409.3215) (‎被引用 6379 次)  
Sequence to Sequence Learning with Neural Networks  
[ github ](http://github.com/NervanaSystems/neon/tree/master/examples/nmt) |
NervanaSystems/neon

###  文章目录

    * 论文内容 
            * 》Sequence to sequence 基本原理 
            * 》文中提出的亮点 
            * 》实验与分析 
    * 本文小结 
    * 参考资料 

##  论文内容

######  》Sequence to sequence 基本原理

由于DNNs （Deep Neural Networks）只能处理输入和输出可以被映射到固定维度的问题，无法处理机器翻译、语音识别、问答系统等序列任务。于是
Sutskever 等人提出了 seq2seq 模型来处理序列任务，模型的结构如下如所示。

在那时，与该论文相似的工作有 [ Kalchbrenner 等人的研究工作](http://www.aclweb.org/anthology/D13-1176) ，不过他们使用了 CNN 来编码输入句子，忽略了句子中单词的顺序。  
![在这里插入图片描述](http://img-blog.csdnimg.cn/20190518161809300.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly90enV3cGt1LmJsb2cuY3Nkbi5uZXQ=,size_16,color_FFFFFF,t_70#pic_center)

(1)  h  t  =  s  i  g  m  o  i  d  (  W  h  x  x  t  ,  \+  W  h  h  h  t  −
1  )  ht=sigmoid(W^{hx}x_t,+ W^{hh} h_{t-1}) \tag1  h  t  =  s  i  g  m  o  i
d  (  W  h  x  x  t  ​  ,  \+  W  h  h  h  t  −  1  ​  )  (  1  )

(2)  y  t  =  W  y  h  h  t  y_t=W^{yh} h_t \tag2  y  t  ​  =  W  y  h  h  t
​  (  2  )

式(1-2)是最普通的 RNN
模型公式。通过递归的RNN结构，让模型学习将输入序列映射到固定长度的向量(见参考文献1），并且将这个学习到的向量作为另一个RNN模型的隐层初始值  h  t
′  h_t^{&#x27;}  h  t  ′  ​  ，第二个 RNN 模型的输出  y  t  ′  y_t^{&#x27;}  y  t  ′  ​
即是序列到序列模型的输出。上图中  &lt;EOS&gt;  \text{&lt;EOS&gt;}  <EOS> 的左边是第一个 RNN
模型，右边是第二个。

seq2seq模型的目标是要估计(3)式的条件概率。(3)式中，首先需要由第一个RNN模型得到对输入序列的向量表达，然后通过第二个 RNN
模型的递归结构来挨个计算seq2seq模型的输出，即是一个 RNN-LM的模型（一般来说长度  T  ′  T&#x27;  T  ′  不等于  T  T
T  ）。seq2seq模型的输出（等号右边的每个概率）是通过在所有词库上计算softmax得到。

(3)  p  (  y  1  ,  .  .  .  ,  y  T  ′  ∣  x  1  ,  .  .  .  ,  x  T  )  =  ∏
t  =  1  T  ′  p  (  y  t  ∣  v  ,  y  1  ,  .  .  .  ,  y  t  −  1  )
p(y_1,...,y_{T&#x27;} | x_1,...,x_{T}) = \prod_{t=1}^{T&#x27;} p(y_t | v,
y_1,...,y_{t-1}) \tag3  p  (  y  1  ​  ,  .  .  .  ,  y  T  ′  ​  ∣  x  1  ​
,  .  .  .  ,  x  T  ​  )  =  t  =  1  ∏  T  ′  ​  p  (  y  t  ​  ∣  v  ,  y
1  ​  ,  .  .  .  ,  y  t  −  1  ​  )  (  3  )

具体而言，seq2seq模型的训练目标是最大化对数概率，如下式。而在解码时则是选则概率最高的输出序列。

argmax  ⁡  W  h  x  ,  W  h  h  {  1  ∣  train set  ∣  ∑  T  ,  S  ∈  train
set  log  p  (  T  ∣  S  )  }  \underset{W^{hx},W^{hh}}
{\operatorname{argmax}} \\{ \frac{1}{|\text{train set}|} \sum_{T,S \in
\text{train set}} \text{log } p(T|S) \\}  W  h  x  ,  W  h  h  a  r  g  m  a
x  ​  {  ∣  train set  ∣  1  ​  T  ,  S  ∈  train set  ∑  ​  log  p  (  T  ∣
S  )  }

######  》文中提出的亮点

  * seq2seq模型结构 
  * 更深的RNN模型结构。在实验中，Sutskever 等人使用了4层的LSTM模型。 
  * 颠倒输入端序列，使得输入端序列和输出端序列有更多的短期相关性。 

######  》实验与分析

**数据集**  
WMT’14 English to French test set (ntst14) [ link](http://www.statmt.org/wmt14/translation-task.html)

**细节**

  * 参数 
    * deep LSTM with 4 layers, 1000 hidden layer cells, 1000 dimensional word embedding 
    * input vocab 160,000; output vocab 60,000 
    * batch size=128 with randomly chosen sentences ( different length ) 
      * 为了避免batch内的很多计算是重复的，使得所有batch里面的句子长度尽量一致。如此提高了2倍的训练速度 
    * fixed lr=0.7 for 5 epochs, and halving every half epoch 
  * 梯度消失与梯度爆炸 
    * LSTM能解决梯度消失问题，而对于梯度爆炸，  s  =  ∣  ∣  g  ∣  ∣  2  s=||g||_2  s  =  ∣  ∣  g  ∣  ∣  2  ​  ，若 s>5，则  g  =  5  g  s  g=\frac{5g}{s}  g  =  s  5  g  ​ 
  * 使用 LSTM 模型对基准模型（SMT模型）重排序 (rescoring)，有效地提升了性能。 

**结果与分析**

> 使用了 [ multi-bleu.pl ](http://github.com/moses-smt/mosesdecoder/blob/master/scripts/generic/multi-bleu.perl) 来计算 BLEU
评价指标评估模型的翻译性能。

![表一](http://img-blog.csdnimg.cn/20190518212835601.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly90enV3cGt1LmJsb2cuY3Nkbi5uZXQ=,size_16,color_FFFFFF,t_70#pic_center)  
对于上表，单纯使用NMT方法：

  * Bahdanau et al.   
( [ Neural machine translation by jointly learning to align and translate](http://arxiv.org/abs/1409.0473) )  
使用注意力机制克服长句子性能较差的问题， ~~效果不错~~ ，该篇也是THUNLP-MT入门的论文之一。

  * Baseline System ( [29] in origin paper )   
( [ CSLM - A modular Open-Source Continuous Space Language Modeling Toolkit](http://www.matecat.com/wp-content/uploads/2013/11/Schwenk.cslm_.is2013.pdf)
)

可以发现，  
1\. “Ensemble of 5 LSTMs，beam size=2” 设定训练的模型性能，与相同设定下 beam size=12
的性能差不多（34.50 vs. 34.81）；另外，文中也提到“Ensemble of 5 LSTMs，beam size=2” 设定的模型训练，比单个"
LSTMs, beam size=12"设定的模型，计算量还小。  
2\. 结果并没有 “Best WMT’14 result” 好。34.81 vs. 38.0  
但是，却是首次纯 NMT 模型表现比 phrased based SMT Baseline 要好。

![在这里插入图片描述](http://img-blog.csdnimg.cn/20190518212907728.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly90enV3cGt1LmJsb2cuY3Nkbi5uZXQ=,size_16,color_FFFFFF,t_70#pic_center)  
对于上表，SMT 和 NMT一起使用的方法：

  * Cho et al.   
[ Learning Phrase Representations using RNN Encoder–Decoder for Statistical
Machine Translation ](http://aclweb.org/anthology/papers/D/D14/D14-1179/)  
模型对长句子的性能表现得很差。

  * Best WMT’14 result   
[ Edinburgh’s Phrase-based Machine Translation Systems for WMT-14](http://aclweb.org/anthology/papers/W/W14/W14-3309/)

  * Rescoring with LSTM   
即将LSTM当做语言模型来重排序 SMT 的 n-best 列表。（LSTM-LM)

可以发现，结果还是没“Best WMT’14 result” （SMT）好。文中给出的原因是 NMT 模型的词库大小有限，而 SMT 模型则未限制词库大小。

![在这里插入图片描述](http://img-blog.csdnimg.cn/20190518233626962.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly90enV3cGt1LmJsb2cuY3Nkbi5uZXQ=,size_16,color_FFFFFF,t_70#pic_center)  
对于文中提出的亮点的相关实验：

**将输入映射到固定长度的向量空间**

  * 上图可以发现，将输入编码成固定长度的向量，对单词的顺序敏感，能捕捉到词袋模型难以捕捉的词序。（例如，“Mary admires John.” 和 “John admires Mary.”两个句子之间是有一定距离的，并且类似的句子有相同的情况。） 
  * 另一方面，向量对主动语态和被动语态较不敏感。例如，“In the garden, I gave her a card.” 和 “She was given a card by me in the garden.”的距离非常相近，两者的差异模型可能较难区别。 

![在这里插入图片描述](http://img-blog.csdnimg.cn/20190518233821183.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly90enV3cGt1LmJsb2cuY3Nkbi5uZXQ=,size_16,color_FFFFFF,t_70#pic_center)  
**seq2seq模型处理长句子的性能** | 比较了 SMT 基准模型和 LSTM-based 的seq2seq模型

  * 对于上左图，y 轴是测试句子的 BLEU 分数，并且按照句子的长度排序（x轴）。（值得一提的是，这里的长度指的是原句子的长度，而不是输出的长度。）可以发现，对于长度小于 35 的句子，seq2seq模型的表现都由于基准模型，只在最长句子的地方模型性能轻微退化到和基准模型一样的水平。 
  * 对于上右图，y 轴同样是测试句子的 BLEU 分数，并且按照句子中单词的平均出现频率排序（x轴），排序越靠后代表单词在训练集中出现的越少。可以发现，句子中单词越稀有，模型的性能越差，即 NMT 模型中的稀有单词/未登录词问题。 

##  本文小结

原论文得出了以下结论：

  1. LSTM-based seq2seq模型能翻译较长的句子，尽管有一些类似工作表示了相反的结果。 
  2. 颠倒输入端序列，使得模型的 BLEU 分数从 25.9 提高到 30.6，同时困惑度也降低了。 
  3. seq2seq模型虽然基于有限的词库大小，但是其性能超过 SMT 模型是毋庸置疑的。 

##  参考资料

  1. Learningphraserepresen- tations using RNN encoder-decoder for statistical machine translation 
  2. [ 深度学习方法（八）：自然语言处理中的Encoder-Decoder模型，基本Sequence to Sequence模型 ](http://blog.csdn.net/xbinworld/article/details/54605408) | 大饼博士X 
  3. [ Sequence to Sequence Learning with Neural Networks ](http://blog.csdn.net/u013713117/article/details/54773467) | mstar1992 

