---
layout:  post
title:    "[ THUNLP-MT (7/10) ] Neural Machine Translation by Jointly Learning to Align and Translate | 注意力机制"
date:   2019-08-11 22:47:42                    
author:  "tzuw"
header-img: "img/post-bg-2015.jpg"
catalog:   false
tags: [seq2seq, LSTM, csdn, 注意力机制]
categories: 神经机器翻译
---
被引用 6824 次，又是一篇高引用神作。也是紧跟在seq2seq模型原论文，列表中 [ THUNLP-MT (6/10)](http://tzuwpku.blog.csdn.net/article/details/90286590)
，后面的一篇论文。介绍了现今NLP领域中非常重要的注意力机制。同样介绍注意力机制的论文还有， [ Luong等人的工作](http://aclweb.org/anthology/papers/D/D15/D15-1166/) 。

[ 论文传送门1 ](http://arxiv.org/abs/1409.0473) | ICLR 2015; Bahdanau等人  
Neural Machine Translation by Jointly Learning to Align and Translate  
[ 论文传送门2 ](http://aclweb.org/anthology/papers/D/D15/D15-1166/) | EMNLP 2015;
Luong等人  
Effective Approaches to Attention-based Neural Machine Translation

###  文章目录

    * 论文内容 （Bahdanau） 
          * 核心原理 
          * 实验与分析 
    * 相关论文 Luong 2015 
    * 参考资料 

##  论文内容 （Bahdanau）

#####  核心原理

~~怎么样才说的明白~~  
解码器端的隐层状态  s  i  s_i  s  i  ​  由上一个隐层状态、解码端加权得到的上下文向量  c  i  c_i  c  i  ​
、上一个状态的目标词  y  i  −  1  y_{i-1}  y  i  −  1  ​  得到。

s  i  =  f  (  s  i  −  1  ,  y  i  −  1  ,  c  i  )  s_i =
f(s_{i-1},y_{i-1},c_i)  s  i  ​  =  f  (  s  i  −  1  ​  ,  y  i  −  1  ​  ,
c  i  ​  )  
![在这里插入图片描述](http://img-blog.csdnimg.cn/20190615175710707.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly90enV3cGt1LmJsb2cuY3Nkbi5uZXQ=,size_16,color_FFFFFF,t_70#pic_center)

![在这里插入图片描述](http://img-blog.csdnimg.cn/20190615165940263.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly90enV3cGt1LmJsb2cuY3Nkbi5uZXQ=,size_16,color_FFFFFF,t_70#pic_center)

#####  实验与分析

**》实验**  
在Bahdanau等人等人的工作中，共训练了两种模型。RNNenc 和 RNNsearch。其中，RNNenc 指的是 [ Cho 等人的工作](http://aclweb.org/anthology/papers/D/D14/D14-1179/) (2014)；RNNsearch 则是
Bahdanau 的研究工作。两个模型都分别训练了句子长度等于30和50的两种模型。并且，隐层节点数均为1000，而 RNNenc 并没有使用双向的 RNN
编码器。  
实验结果可以发现，RNNsearch模型性能优于RNNenc模型；并且，在句子长度较长时，RNNsearch模型的性能没有显著的下降。  
![在这里插入图片描述](http://img-blog.csdnimg.cn/20190615195920130.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly90enV3cGt1LmJsb2cuY3Nkbi5uZXQ=,size_16,color_FFFFFF,t_70#pic_center)

**》分析**

  * soft alignment 的性能要优于 hard alignment。 
    * soft alignment 指的是在为 t 时刻的输出 y 求上下文向量时，对输入句子的每一个单词都给出一个注意力概率，即一个对齐模型。而 hard alignment 则指的是，直接找出与输出 y 对应的输入句子单词。 

##  相关论文 Luong 2015

[ Effective Approaches to Attention-based Neural Machine Translation](http://aclweb.org/anthology/papers/D/D15/D15-1166/)

  * 与 Bahdanau 研究工作的不同 
    * Luong 使用了多层的 LSTM 结构，用顶层的LSTM表示隐层状态；而 Bahdanau 则是使用双向的RNN结构，在源语言端的隐层状态，由前向和后向的RNN隐层状态拼接得到，并且 RNN 的结构使用了 [ Cho 等人的工作 ](http://aclweb.org/anthology/papers/D/D14/D14-1179/) (2014) 提出的 GRU 结构。 
    * Luong 等人在计算时当前 Attentional Hidden State  h  i  ~  \widetilde{h_i}  h  i  ​  ​  时加入了  h  i  −  1  ~  \widetilde{h_{i-1}}  h  i  −  1  ​  ​  进行计算，即将过去的对齐信息用来计算当前解码器隐层状态。而 Bahdanau 等人则是只将前一时刻的隐层状态  z  i  −  1  z_{i-1}  z  i  −  1  ​  用来计算解码器的隐层状态中。 
    * 两种不同的注意力机制：局部注意力机制 与 全局注意力机制 
    * 多种对齐打分函数 

Luong ( 全局注意力 )  
![在这里插入图片描述](http://img-blog.csdnimg.cn/20190615202904221.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly90enV3cGt1LmJsb2cuY3Nkbi5uZXQ=,size_16,color_FFFFFF,t_70#pic_center)

Bahdanau  
![在这里插入图片描述](http://img-blog.csdnimg.cn/20190615203502980.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly90enV3cGt1LmJsb2cuY3Nkbi5uZXQ=,size_16,color_FFFFFF,t_70#pic_center)

##  参考资料

  1. [ 神经网络机器翻译Neural Machine Translation(2): Attention Mechanism ](http://blog.csdn.net/u011414416/article/details/51057789)
  2. [ 神经网络机器翻译Neural Machine Translation(1): Encoder-Decoder Architecture ](http://blog.csdn.net/u011414416/article/details/51048994)

