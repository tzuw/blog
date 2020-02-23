---
layout:  post
title: "cs224n 课堂笔记5" 
date:   2019-08-11 22:47:42                    
author:  "tzuw"
header-img: "img/post-bg-2015.jpg"
catalog: false
tags: [Language Model, cs224n, RNN, BiRNN]
categories: NLP
---
## 课堂笔记5 cs224n 

 `(2017/10/08 21:44:33)` 

关键字：Language Model; Recurrent Neural Network; Bi-directional RNN; GRU; LSTM

1. ##### Language Models

   - An incorrect but necessary Markov assumption. 
     - 下一个状态取决于前n个状态
       - 用公式表达：<img src="../pics/language_markovAssumption.PNG
       - " height="60px">
     - 传统的语言模型，<u>根据简单的统计个数</u>估计一句话是人说的概率，方法可以记为unigrams（n=1）, bigrams（n=2）
       - 数学可以记为：<img src="../pics/language_unigram.PNG" height="50px">
       - 语言模型随着窗口大小n的增加而表现得更好，但是同时也要求非常大的内存，内存需求随着窗口大小指数成长
       - 只根据前面的连续词语来预测下一个词，特征不足够s
   - Learning a distributed representation of words  (Bengio et al.)

2. ##### Recurrent Neural Networks

   - model can depend on all previous words in the corpus

   - loss function: 

     - <img src="../pics/rnn_languageModel_0.PNG" height="75px">	<img src="../pics/rnn_languageModel_0.PNG" height="75px">
     - 其中，|V| 代表Vocabulary 词汇； T 代表语料库长度

     ​

   - Perplexity

     - A measure of confusion where lower values imply more confidence in predicting the next word in the sequence.
     - 衡量模型的困惑程度，perplexity值越小，模型预测序列中下一个词语的准确性就越高。
     - 数学表示：2 ^J

     ​

   - The amount of memory required to run a layer of RNN is proportional to the number of words in the corpus.

     - 举例来说，一个包含k个词语的句子会有k个向量在记忆体中。
     - 当然RNN也必须要维护2组权重矩阵W、b。虽然权重矩阵也肯恩那个变得很大，但是和传统语言模型不同的地方在于，RNN语言模型需要更新的权重个数只取决于隐藏层的神经元个数。

     ​

   - Vanishing Gradient & Explosion Problems

     - recall the goal of RNN is to enable propagating context information through faraway time-step.
       - for example, "Jane walked into the room. John walked in, too. It was late in the day, and everyone was walking home after a long day work. Jane said hi to ____________ ."
     - ​

