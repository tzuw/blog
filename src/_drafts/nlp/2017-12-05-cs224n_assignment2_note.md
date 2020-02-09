---
layout:  post
title: "cs224n_assignment_2" 
date:   2019-08-11 22:47:42                    
author:  "tzuw"
header-img: "img/post-bg-2015.jpg"
catalog:   false
tags: 自然語言處理 
---
### 作业2 （2017/9/26 15:40:13）

### 1. **Tensorflow Softmax**

### 2. **Neural Transition-Based Dependency Parsing**

> 用python实现neural-network based dependency parser; 基于神经网络的转移依存句法分析
> 
> 简单理解：基于神经网络的依存分析器。一个典型的依存分析器，一般会输出一个依存语法树的结构，来表示句子的语法结构。而这里的方法是，利用状态转移的方法来训练。	

- **(e)** Xavier initialization 参数初始化的python实现

	- 代码:
		- `epsilon = np.sqrt(6/(np.sum([ i for i in shape]))`
		- `out = tf.truncated_uniform( shape, stddev = epsilon)`


- **(f)** Dropout hidden layer 的数学表示式
  - dropout是在训练神经网络是的一种正则化方法。
  - 在训练神经网络时，每一次的训练使用部分的神经元，更准确的说每个神经元在训练的时候有 p 的几率被舍弃.这题表达的意思（我自己的理解）：希望dropout过后的隐藏层仍然拥有相同的期望值。这里好像和笔记中提到的有相关，在使用dropout进行正则化时要特别注意保持神经网络结构的稳定( well-defined )。
  - ![drop-out-expectation](../pics/drop-out-expectation.PNG)
  - 其中，![经过drop-out的隐藏层表示](../pics/经过drop-out的隐藏层表示.PNG)，而d是一个遮罩向量，每个元素有p概率为零。圈圈代表两个向量的point-wise相乘。【ref：[码农场](http://www.hankcs.com/nlp/cs224n-assignment-2.html/2)】


- **(g)** *Adam optimizer* 介绍：一种可以代替SGD训练神经网络参数的优化算法。

  - 名字的由来：adaptive moment estimation。
  - Adam是在Computer Vision和NLP领域被广为采纳的优化算法，作为SGD的一种延伸。在求解非凸优化问题时有<u>优势</u>
	  - 避免梯度的剧烈振荡
	  - 在梯度很小的地方也能快速的移动   ++++++哇，这里参数更新的方式就是物理**动量**的概念。
	  - “keep track the rolling average of  both the gradient and the magnitude of gradient. 

  - **深入了解**：
	  - i. 《An overview of gradient descent optimization algorithms》, Sebiastian Ruder; 介绍了很多梯度下降算法的变种
	  - ii. 梯度下降算法的比较，这里记录一下：可以参考[Slinuxer](https://blog.slinuxer.com/2016/09/sgd-comparison)

- **(h)** 实现基于神经网络的句法分析分类器，用到的数据集 Penn Treebank

	- tf.nn.embedding_lookup( tensor, id ): 选取一个张量里索引对应的元素 ​
	- xavier_weight_init() 参数初始化比较, 这里究竟要用那种比较好呢？ 
	- 题目要求使用 " Given a matrix A of dimension m × n, Xavier initialization selects values Aij uniformly from -epsilon, epsilon "
		- `out = tf.Variable(tf.random_uniform(shape=shape, minval=-epsilon, maxval=epsilon))`
			- 生成范围在[-epsilon, epsilon]的均匀分布。
	    - `out = tf.truncated_normal(shape, stddev=epsilon)`
		    - 生成标准差为epsilon，均值为零的正态分布。
		- 相似的 numpy 也有类似的函数：
			- `numpy.random.uniform(low, high, size); numpy.random.normal(loc, scale, size); size=output shape`

	- softmax_cross_entropy_with_logits(labels, logit)
		- logits 表示最后一个隐藏层的输出
		- tensorflow 把softmax和交叉熵放到一个函数里计算，为了提高运算效率

			- <img src="../pics/ass2-2-结果.PNG" height="100px" width="300px">

- **(i)** Bonus: 为你的模型多加上一层隐藏层，或者加上l2 regularization.
- 进阶参考资料：
	- [基于神经网络的高性能依存句法分析器](http://www.hankcs.com/nlp/parsing/neural-network-based-dependency-parser.html)
	- [ A Fast and Accurate Dependency Parser using Neural Networks](http://cs.stanford.edu/people/danqi/papers/emnlp2014.pdf)



### 3. Recurrent Neural Network: Language Modeling

> 在第三部分，题目要求计算一个RNN语言模型的梯度。语言建模是自然语言处理的核心任务，语言模型时很多应用中都有重要的作用，比如，*语音识别、机器翻译、词性标注、句法分析、信息检*索。。等。给定用one-hot vector表示的一个词序列，语言模型预测根据前面的词语预测下一个词是某个词的后验概率。
> 
> 作业上给出了一个基于RNN的语言模型的概要

- (a) 语言模型的效果用*困惑度perplexity*来衡量； 困惑度表示的是，语言模型预测正确的词的概率的倒数。
	- "the cross-entropy is the logarithm of perplexity."
	- 语料库大小为|V|，如果模型完全随机预测（直接均匀的从语料库中预测词），那么这个语言模型的困惑度，和对应的cross-entropy为多少？语料库大小10000
		- ans： perplecity = |V| = 10000, cross-entropy = log|V| = 9.21

- (b) **mark一下**，求神经网络的梯度的时候，先求其残差（error signal），会简化很多步骤。（也就是损失函数对神经元的输入求梯度。）
	- <img src="../pics/rnn.jpg" height="150px" width="300px">

- (c) 在没有合并显示的三层神经网络上，计算梯度。

- (d) 复杂度，存在的问题在哪里？以及如何优化。

	- 给定RNN隐藏层上一个状态的输出，前向传播到损失函数输出需要几步？

	- ||| 


- 2017/9/27 23:59:15 记录一下百度落选，没有如愿以偿但是还是要继续努力。但是，目标越来越清晰了。要变得更强！



### 4. Reference

> [hankcs_cs224n_ass2](http://www.hankcs.com/nlp/cs224n-assignment-2.html)

> [rymc9384/DeepNLP_CS224N](https://github.com/rymc9384/DeepNLP_CS224N)
