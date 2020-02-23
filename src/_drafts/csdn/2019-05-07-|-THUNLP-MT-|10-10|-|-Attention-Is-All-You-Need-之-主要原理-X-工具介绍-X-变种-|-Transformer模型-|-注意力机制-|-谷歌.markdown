---
layout:  post
title:    "[ THUNLP-MT (10/10) ] Attention Is All You Need 之 主要原理 X 工具介绍 X 变种 | Transformer模型 + 注意力机制 + 谷歌"
date:   2019-05-07 21:44:48                    
author:  "tzuw"
header-img: "img/post-bg-2015.jpg"
catalog:   false
tags: Transformer模型
categories: 神经机器翻译
---
该论文由Vaswani在2017年发布，他已经将近两岁了呢，针对该模型提出的应用和变种层出不穷。此外，该论文也是THUNLP-MT推荐的必读十篇论文之一哦！  
论文传送门： [ Attention Is All You Need ](http://arxiv.org/abs/1706.03762)

本文主要分为三部分：Transformer模型主要原理，模型的变种介绍和相关工具的介绍。主要为入门小白提供更好的学习体验，欢迎讨论呀。

###  文章目录

    * Transformer模型 之 主要原理 
    * Transformer模型 之 变种 
    * Transformer模型 之 工具介绍 
    * 参考资料 

* * *

##  Transformer模型 之 主要原理

**》自注意力机制的原理**  
与神经编解码模型不同，Transformer模型中没有递归的神经元，也没有卷积操作，只基于注意力机制，也因此在训练时能高效的并行处理，训练的效率较高。此外，该模型和一般的神经编解码模型不同，注意力机制是发生在输入句子和输出句子各自的内部元素之间。

为了更易于理解，本文将公式拆分成单个向量如下：

(1)  Attention  (  Q  i  ,  K  i  ,  V  i  )  =  s  o  f  t  m  a  x  (  Q  i
K  i  T  d  k  )  V  i
\text{Attention}(\bf{Q_i},\bf{K_i},\bf{V_i})=softmax(\frac{\bf{Q_iK_i^T}}{\sqrt{\bf{d_k}}})\bf{V_i}
\tag1  Attention  (  Q  i  ​  ,  K  i  ​  ,  V  i  ​  )  =  s  o  f  t  m  a
x  (  d  k  ​  ​  Q  i  ​  K  i  T  ​  ​  )  V  i  ​  (  1  )

其中，  Q  i  ∈  R  k  \bf{Q_i}\in \mathbb{R^k}  Q  i  ​  ∈  R  k
是Query，代表了输出句子中某个元素的语义编码，而  K  i  ∈  R  k  \bf{K_i}\in \mathbb{R^k}  K  i  ​
∈  R  k  和  V  i  ∈  R  v  ,  \bf{V_i}\in \mathbb{R^v},  V  i  ​  ∈  R  v  ,
分别是Key和Value，都代表了输入句子中某个元素的语义编码。  d  k  \sqrt{\bf{d_k}}  d  k  ​  ​  则表示  K  i
\bf{K_i}  K  i  ​  的维度开根号。(1)式的输出结果是一个  v  \bf{v}  v  维的向量，表示某个Key-Value对下的所对应元素的增强语义向量。

举例而言，对于输入句子，“我 爱 中文”来说。若“我”是  Q  i  \bf{Q_i}  Q  i  ​  ，当前的  K  i  \bf{K_i}  K
i  ​  和  V  i  \bf{V_i}  V  i  ​  对应的是“爱”，那么，“我”的第一个注意力权重值就可以由计算  Q  i
\bf{Q_i}  Q  i  ​  “我” 和  V  i  \bf{V_i}  V  i  ​  “爱” 之间的相似性得到。同理，当  K  i
\bf{K_i}  K  i  ​  和  V  i  \bf{V_i}  V  i  ​  对应的是“中文”，“我”的第二个注意力权重值也可以得到。

在实际计算时，通常将所有的Key和Value一起做矩阵乘法运算。

(1)  Attention  (  Q  i  ,  K  ,  V  )  =  ∑  j  =  1  m  s  o  f  t  m  a  x
(  Q  i  K  j  T  d  k  )  V  j
\text{Attention}(\bf{Q_i},\bf{K},\bf{V})=\sum_{j=1}^{m}softmax(\frac{\bf{Q_iK_j^T}}{\sqrt{\bf{d_k}}})\bf{V_j}
\tag1  Attention  (  Q  i  ​  ,  K  ,  V  )  =  j  =  1  ∑  m  ​  s  o  f  t
m  a  x  (  d  k  ​  ​  Q  i  ​  K  j  T  ​  ​  )  V  j  ​  (  1  )

其中，  Q  i  ∈  R  n  ×  k  \bf{Q_i}\in \mathbb{R^{n \times k}}  Q  i  ​  ∈  R
n  ×  k  ，  K  i  ∈  R  m  ×  k  \bf{K_i}\in \mathbb{R^{m \times k}}  K  i  ​
∈  R  m  ×  k  ，  V  i  ∈  R  m  ×  v  \bf{V_i}\in \mathbb{R^{m \times v}}  V
i  ​  ∈  R  m  ×  v  。即根据每个Key-Value对得到的权重加权求和，得到当前  Q  i  \bf{Q_i}  Q  i  ​
的增强语义向量。如下图所示 [ [出处] ](http://mp.weixin.qq.com/s/HOt11jG0DhhVuFWYhKNXtg) 。

![在这里插入图片描述](http://img-blog.csdnimg.cn/20190505171032364.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly90enV3cGt1LmJsb2cuY3Nkbi5uZXQ=,size_16,color_FFFFFF,t_70#pic_center)  
**》多头的自注意力机制**  
![在这里插入图片描述](http://img-blog.csdnimg.cn/2019050521250866.png)  
文后的参考资料也列出了大神们对该论文的相关介绍，有兴趣请参考hhh。

**》模型主要结构**  
由堆叠的编码器和解码器组成，单个编码器中包含了多头自注意力层、全连接层，而解码器则相对于编码器多了一个接收编码器输出的自注意力层。

在编解码器中全连接层和自注意力层值后，加入了Normalization Layer和残差连接技术 Residual
Network，这使得模型更容易训练。Normalization Layer也能改善深度神经编解码模型中的 Internal Covariate Shift
问题。

* * *

##  Transformer模型 之 变种

下面的内容是笔者主要从论文中翻译及理解。

**Average Attention Layer**  
[ Accelerating Neural Transformer via an Average Attention Network](http://arxiv.org/abs/1805.00631)

> 为了解决Transformer模型在解码时的瓶颈，在Vaswani提出的Transformer模型的解码器尾端加入Average Attention
Layer，使得解码也能并行操作，提升了解码时的效率。该网络层主要包含两个部分，平均层和闸门前馈网络层。  
>  平均层的主要功能是通过取平均来总结在之前位置上的历史信息，对比于原模型中动态计算权重，此处使用了固定的平均权重；
闸门前馈网络层的作用是改善模型的表达能力。  
>  在原文中也提到，其实平均层就等价于原始的注意力网络，只是它原来通过适应性计算出来的注意力权重被更改为了平均过后的权重。

**Weighted Attention**  
[ Weighted Transformer Network for Machine Translation](http://arxiv.org/abs/1711.02132)

> Weighted Transformer模型是一种具有变种注意力层的Transformer模型，它由Karim
Ahmed的研究工作提出，据文献道其不仅在BLEU得分上优于原始的Transformer，而且提高了模型训练的收敛速度。  
>  该模型将多头自注意力层换成了多个自注意力分支，并且模型在训练的过程中也学习了如何组合这些分支。具体的，该模型通过Concatenation
Scaling layer (k) 和 Addition Scaling layer
(α)来对不同分支的自注意力层和前馈层赋予不同的权重，其中k可以理解为用来衡量每个自注意力层输出的贡献的权重，a可以理解为用来加总不同前馈层输出的权重。  
>  它的运作流程是：在前向传播时，在Concatenation Scaling
layer中对每组自注意力层的输出都乘上其对应的权重，并且根据原来的顺序进行拼接后作为该层的输出。此外，在Addition Scaling
layer中，将多组前馈层的输出作为输入，并且将它们乘上对应的权重后想相加作为该层的输出。这个过程简化了优化过程并使得各个分支学习了负相关的输入和输出映射，如此减少了神经元之间的相互协调，增强了模型的泛化性能。此外，使用这两个网络层并不会向网络添加大量参数。  
>  .  
>  在 WMT 2018 竞赛上，阿里参赛团队使用了改变种模型。

**BERT** [ [Github] ](http://github.com/google-research/bert)  
[ BERT: Pre-training of Deep Bidirectional Transformers for Language
Understanding ](http://arxiv.org/abs/1810.04805)

> 模型的主要创新点都在预训练上，即Masked Language Model 和 Next Sentence Prediction。  
>  传送门：  
>  [ 图解BERT模型：从零开始构建BERT ](http://mp.weixin.qq.com/s/HOt11jG0DhhVuFWYhKNXtg)  
>  [ 【NLP】Google BERT详解 ](http://zhuanlan.zhihu.com/p/46652512)

**Transformer-XL** [ [Github] ](http://github.com/kimiyoung/transformer-xl)  
[ Transformer-XL: Attentive Language Models Beyond a Fixed-Length Context](http://arxiv.org/abs/1901.02860)

> 引入了循环机制和相对位置编码，使得模型能对更长的序列建模。  
>  传送门：  
>  [ Transformer-XL – Combining Transformers and RNNs Into a State-of-the-art
Language Model ](http://www.lyrn.ai/2019/01/16/transformer-xl-sota-language-model/)  
>  [ 谷歌开源先进语言模型 Transformer-XL：集 Transformer 和 RNN 之大成](http://www.infoq.cn/article/wt-KaTfcsAv9E7exzIkF)

* * *

##  Transformer模型 之 工具介绍

Transformer模型的主要应用有对话系统、文本摘要、机器翻译、与机器翻译类似的语法错误修正任务等等。本小节介绍主流的神经编解码工具，提供各种传送门。

相关工具

  * [ Marian ](http://marian-nmt.github.io/) [ [Github] ](http://github.com/marian-nmt/marian) | [Paper]   
它是一个开源的C++神经编解码工具，使用了命令行的形式来训练和预测模型。此外，还提供了更快的模型解码方式 ( 加入Average Attention
Layer )。使用该工具的近期研究工作有：

    * [ Marian: Cost-effective High-Quality Neural Machine Translation in C++. In Proceedings of the Second Workshop on Neural Machine Translation ](http://arxiv.org/abs/1805.12096)
    * [ Fast Neural Machine Translation Implementation ](http://arxiv.org/abs/1805.09863)
    * [ Approaching Neural Grammatical Error Correction as a Low-Resource Machine Translation Task ](http://arxiv.org/abs/1804.05940)
  * fairseq [ [Github] ](http://github.com/pytorch/fairseq) | [ [Paper] ](http://www.aclweb.org/anthology/P18-4020)   
基于Pytorch的建模工具。更新频繁，最近又加入了新的变种Transformer模型。  
使用fairseq的近期研究工作：

    * [ Pre-trained Language Model Representations for Language Generation ](http://arxiv.org/pdf/1903.09722.pdf?fbclid=IwAR11P4KK9ninhdkj579oaM2OllbWE6TynuuY8SbHXxod4diXaI9n18C5ARw) | Facebook AI | 文本摘要 
    * [ Reaching Human-level Performance in Automatic Grammatical Error Correction: An Empirical Study ](http://arxiv.org/abs/1807.01270) | [ [github] ](http://github.com/rgcottrell/pytorch-human-performance-gec) | 语法错误修正 
    * [ A Multilayer Convolutional Encoder-Decoder Neural Network for Grammatical Error Correction ](http://www.aaai.org/ocs/index.php/AAAI/AAAI18/paper/viewFile/17308/16137) | [ [github] ](http://github.com/nusnlp/mlconvgec2018) | 语法错误修正 
  * OpenNMT [ [Github] ](http://github.com/OpenNMT/OpenNMT-tf) | [ [Paper] ](http://arxiv.org/abs/1701.02810)   
感觉社区较为友好（使用人数较多），目前活跃的版本有Tensorflow版本和Pytorch版本。其中，Tensorflow版本不仅提供命令行的使用方式，还提供了API接口。  
近期使用该工具的研究工作有： [ 传送门 ](http://opennmt.net/OpenNMT/references/)

    * [ Better Automatic Evaluation of Open-Domain Dialogue Systems with Contextualized Embeddings ](http://arxiv.org/abs/1904.10635) | 对话系统 
  * tensor2tensor [ [Github] ](http://github.com/tensorflow/tensor2tensor) | [ [Paper] ](http://arxiv.org/abs/1803.07416)   
谷歌开源的深度学习库，提供API接口。  
近期使用该工具的研究工作有：

    * [ Universal Transformers ](http://arxiv.org/abs/1807.03819)

* * *

##  参考资料

  1. Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, and Illia Polosukhin. 2017. [ Attention is All You Need ](http://papers.nips.cc/paper/7181-attention-is-all-you-need.pdf) . In _Proceedings of NIPS 2017_ . ( [ Citation ](http://scholar.google.com/scholar?cites=2960712678066186980&as_sdt=2005&sciodt=0,5&hl=en) : 1,047) 
  2. [ The Illustrated Transformer ](http://jalammar.github.io/illustrated-transformer/) Jay Alammar 
  3. [ The Illustrated Transformer【译】 ](http://blog.csdn.net/yujianmin1990/article/details/85221271)
  4. [ The Annotated Transformer ](http://nlp.seas.harvard.edu/2018/04/03/attention.html)
  5. [ 《Attention is All You Need》浅读（简介+代码） ](http://kexue.fm/archives/4765) | 苏剑林 
  6. [ nlp中的Attention注意力机制+Transformer详解 ](http://zhuanlan.zhihu.com/p/53682800)
  7. [ 图解BERT模型：从零开始构建BERT ](http://mp.weixin.qq.com/s/HOt11jG0DhhVuFWYhKNXtg) (文中图片出处) 
  8. [ 深度学习中的注意力模型（2017版） ](http://zhuanlan.zhihu.com/p/37601161) | 张俊林 
  9. [ 详解深度学习中的Normalization，BN/LN/WN ](http://zhuanlan.zhihu.com/p/33173246)

