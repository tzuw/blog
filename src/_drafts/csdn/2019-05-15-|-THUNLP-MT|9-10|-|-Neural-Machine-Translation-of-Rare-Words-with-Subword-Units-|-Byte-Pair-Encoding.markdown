---
layout:  post
title:    "[ THUNLP-MT(9/10) ] Neural Machine Translation of Rare Words with Subword Units | Byte Pair Encoding"
date:   2019-05-15 15:13:31                    
author:  "tzuw"
header-img: "img/post-bg-2015.jpg"
catalog:   false
tags: 自然語言處理 csdn

---
Sennrich在ACL’2016发表的论文，主要研究神经机器翻译模型中的未登录词问题，提出了Byte Pair
Encoding方法，同时该方法也解决了词表过大的问题。本文在介绍Sennrich的研究工作的基础上，也介绍了中文对于未登录词的相关方法。  
[ 论文传送门 ](http://www.aclweb.org/anthology/P16-1162) 引用次数：944

###  文章目录

    * 论文内容 
        * 》问题 
        * 》目标：不需要 back-off model 来解决未登录词问题 
        * 》相关工作介绍及论点 
        * 》解决方法：Byte Pair Encoding（BPE）（Most frequent byte => new byte） 
        * 》实验内容与步骤 
        * 》结论与贡献 
    * 中文的未登录词问题 
    * 相关工具 
    * 参考资料 

##  论文内容

> 除了翻译原论文的内容，也加入了一些思考，文章还是要注意通顺的~

####  》问题

文中提出的问题，此处笔者详细的说明，并给出了某些前人工作的链接。  
（1）实际语言环境中，黏着法构词（agglutination）、复合构词（compounding）产生的词语不仅会造成词表过大
，一般NMT模型的字典大小为30k-50k，难免会造成未登录词问题。  
例如，由上面两种方法构成的德文单词，Abwasserbehandlungsanlange，是“污水处理厂”的意思。

（2）Back-off
模型的方法来达成开放字典的机器翻译模型中的假设在现实情况下未必成立，即输入句子和输出句子中的词语有的时候未必会有一个一对一的对应关系。  
对 Back-off 模型，文中提到了两个相关研究工作：

  * [ Addressing the Rare Word Problem in Neural Machine Translation ](http://arxiv.org/abs/1410.8206) , Luong ACL’2015, 被引用410次   
Luong的方法是，对训练数据中的未登录词进行标注，让神经机器翻译模型自己来学习未登录词的对其信息。具体的步骤是，首先，通过 Berkeley
aligner[ [ link1 ](http://cs.stanford.edu/~pliang/papers/alignment-naacl2006.pdf) , [ link2](http://github.com/mjpost/berkeleyaligner/blob/master/documentation/manual.txt)]
得到来源端和目标端句子之间的对齐信息，并将对齐信息进行筛选处理；然后，通过对齐信息和词库标注，以及论文中提到的3个未登录词标注方法来不标注训练语料；再来，训练神经机器翻译模型；最后，对目标端输出句子进行处理，即通过对齐信息将未登录词替换成对应的翻译词语。

> （英文好的同学可以看原文 Rare Word Models 章节的第二段，3个未登录词标注方法也参见原文哈哈）  
>  We propose to address the rare word problem by training the NMT system to
track the origins of the unknown words in the target sentences. If we knew the
source word responsible for each unknown target word, we could introduce a
postprocessing step that would replace each unk in the system’s output with a
translation of its source word, using either a dictionary or the identity
translation. For example, in Figure 1, if the model knows that the second
unknown token in the NMT (line nn) originates from the source word ecotax, it
can perform a word dictionary lookup to replace that unknown token by
´ecotaxe. Similarly, an identity translation of the source word Pont-de-Buis
can be applied to the third unknown token.

  * [ On Using Very Large Target Vocabulary for Neural Machine Translation ](http://arxiv.org/abs/1412.2007) , Jean ACL’2015 Long paper, 被引用509次   
在Jean的研究工作中，使用了另外训练的词对齐模型来替换目标端的未登录词。此外，他们的研究工作为了解决未登录词和词表大小两者此消彼长的问题，（即为了解决由词表过大引起的目标端的
softmax函数计算量太大的问题），提出了在训练中使用自适应重要性采样机制（sampled softmax）来加速。

> 对于两部分内容，英文好的同学可以看原论文的3.3小节，以及第三章前面。  
>  当然也有一些传送门：  
>  对于sampled-softmax：[ [ 传送门一号](http://blog.csdn.net/mebiuw/article/details/68952814) ] [ [ 传送门二号](http://blog.csdn.net/wangpeng138375/article/details/75151064) ] [ [ 传送门三号](http://www.zhihu.com/question/62070907) ] [ [ 传送门四号](http://cairohy.github.io/2017/04/12/deeplearning/NLP-vocab-ACL-IJCNLP2015-%E3%80%8AOn%20Using%20Very%20Large%20Target%20Vocabulary%20for%20Neural%20Machine%20Translation%E3%80%8B/)
[ [ 传送门五号 ](http://blog.csdn.net/qunnie_yi/article/details/80128024) ]  
>  对于未登录词问题：[ [ 传送门一号](http://blog.csdn.net/u011414416/article/details/51108193) ] [ [ 传送门二号](http://homepages.inf.ed.ac.uk/rsennric/mt18/7_4up.pdf) ]*

####  》目标：不需要 back-off model 来解决未登录词问题

即在神经机器翻译模型本身的训练中，就直接处理开放词汇的翻译任务。

####  》相关工作介绍及论点

这部分内容主要讨论了未登录词的其它解决方法，包括对人名类词语的处理方法、统计机器翻译中分割词语的词素的方法。

SMT模型中也有不少工作讨论关于分割单词的语素的研究工作，但是较为保守。  
通过相关工作的介绍，Sennrich 对分割子词给出以下意见：

（1） 分割单词的语素的办法最好是基于任务的，并且为每个语素（morphemes）和字符（characters）学习固定长度的向量。  
（2） NMT
模型的注意力机制能够捕捉句子中子词之间的关系，此外，子词粒度的模型能降低训练语料中的词汇，而相比于基于短语的方法，神经机器翻译模型能够通过较小的词汇，在时间和空间效率上获得较大的提升。  
（3） 为了能权衡词库大小和句子长度，往往只将句子中不常见单词分割成常见的词素。

另外还提到了以下相关工作：  
（1） 对于人名类的未登录词，往往能音译后或者直接到拷贝输出句子中。  
（2） 若是输出句子的语言和输出句子的语言相近，或许能直接考虑字符粒度的机器翻译模型，前人的工作有：

  * Can We Translate Letters? | David Vilar. 2017 
  * Character-based PSMT for Closely Related Languages | Jörg Tiedemann. 2009 
  * Machine Translation without Words through Substring Alignment | Graham Neubig. 2012 

####  》解决方法：Byte Pair Encoding（BPE）（Most frequent byte => new byte）

基于相关工作的介绍，Sennrich的思考是，将稀有词语分割成恰当的子词，使得神经网络模型去学习那些显而易见的稀有词语的翻译方法，以此使得模型在测试时能翻译训练中未见到的单词。

**BPE算法步骤** ：

  1. 将所有单词的组成字符加入字典，当做初始化字典。将所有单词变成字符分割的形式，并在的末尾加入特殊标记，方便在输出句子后回复分词信息。 
  2. 对语料中的字符对计数，找出次数最多的字符对(A, B)，并在语料中将其用 “AB” 代替如此就会在字典中增加键值“AB”。此步成为合并操作。 
  3. 迭代 n 次 进行上一步操作。 （该算法唯一的超参数） 
  4. 最终字典大小=初始字典大小+合并操作次数 n。最后词表的组成就混合了字符、词素和词语等等。   
（一句话描述：首先将词分成一个一个的字符，然后在词的范围内统计字符对出现的次数，每次将次数最多的字符对保存起来，直到循环次数结束。）

**joint BPE**  
为了提高两个语言在进行BPE算法时分割操作的一致性，将来源语言和目标语言一起进行BPE算法。具体而言，文中对于英文和俄文之间的翻译，将俄文的词库音译为拉丁字符来学习BPE编码，然后在合并字符时再音译回俄文。

> QA0: shortlist ?

>

>   * "a target vocabulary of the K most frequent word, K=[30k, 80k] ", Jean
ACL’2015

>

>

> QA1: BPE requires no shortlist ?

>

>   * “frequent character n-grams (or whole words) are eventually merged into
a single symbol, thus BPE requires no shortlist.”

>

**cs224n中的例子** [ [ link](http://web.stanford.edu/class/archive/cs/cs224n/cs224n.1174/lectures/cs224n-2017-lecture17.pdf)
p62-28]

####  》实验内容与步骤

**实验目标**  
（1）使用BPE算法能否提高未登录词和训练语料中未出现单词的翻译质量？即希望用一个固定大小的子词字典来表示开放的词库，如此就能高效的训练和解码  
（2）词库大小、句子长度和翻译质量，三者之间如何权衡？

**评估** Evaluation

  * 子词个数的相关统计 Subword Statistic 
    * 比较了不同方法对词库大小和未登录词个数的影响，character n-grams、compound splitting、morfessor、hyphenation和BPE等方法。 
    * 实验发现BPE是有效的，并且达到了测试集中没有未登录词的需求。 
  * 翻译实验 Translation Experiment 
    * 使用的评价指标都偏向了啥 
      * [ BLEU ](http://www.cs.cmu.edu/~archan/coursework/Original_BLEU_V4.ppt) [ [ paper ](http://dl.acm.org/citation.cfm?id=1073135) ACL’02 cited8914] | 更偏向准确率 
        * 用于衡量候选译文和参考译文的n元组之间，共同出现情况的一个程度值 )from IBM 
      * CHRF3 )from [ Results of the WMT15 Met- rics Shared Task ](http://aclweb.org/anthology/papers/W/W15/W15-3031/) ,WMT’2015 | 更偏向召回率 
        * a character n-gram F3 score which was found to correlate well with human judgments, especially for translations out of English. 
      * unigram F1： the harmonic mean of clipped unigram precision and recall 
        * 用来衡量稀有单词和未登录词的翻译质量 
        * = Clipped unigram precision is essentially 1-gram BLEU without brevity penalty 
    * 主要比较了哪些模型: 
      * WUnk：word-level model without a back-off dictionary of size 500,000 on target side 
      * WDict：word-level model with a back-off dictionary of size 500,000 on target side 
      * C2-50k：character-bigram to represent OOV words, with a shortlist of unsegmented words of size 50,000 
      * C2-3/500k：character-bigram to represent OOV words, with a shortlist of unsegmented words of size 50,0000 
      * BPE-60k：vocabulary learnt independently from source and target language of size 60,000 
      * BPE-J90k：vocabulary learnt from union of source and target language of size 90,000 
    * BLEU 和 CHRF3 评价指标之间的不一致 
    * 由于未登录词占测试集的比例不高，BLEU 和 CHRF3 指标的提升并不明显 
    * 原文中表示对稀有单词翻译的优化方式，与网络结构、训练算法、集成模型对模型的优化是无关的。 
    * 神经机器翻译模型性能的可变性仍是一个值得关注的问题。 
      * 文中为了确保模型的稳定度，使用了在8个验证集上表现最好的模型 

**分析** Analysis

  * 一元字符精确率 Unigram accuracy   
（~~rua  那个图怎么理解？从中可以看出哪几点？  ~）  
![在这里插入图片描述](http://img-blog.csdnimg.cn/20190515135246324.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly90enV3cGt1LmJsb2cuY3Nkbi5uZXQ=,size_16,color_FFFFFF,t_70#pic_center)

    * ~~为什么用训练集？~~
    * 上图 x 轴表示的是训练集中的词语出现评率的排名， y 轴表示的是 unigram F1 评价指标。观察发现： 
      * 所有的系统在出现评率排名前 50,000 单词构成的newstest2015数据集上的性能都差不多，而对于出现频率排名在 50,000（f=60） 和 500,000（f=2） 之间，C2-50k 和 C2-3/500k 系统的表现相差较大；尽管它们之间的差别只在 shortlist 的大小，和对出现排名在 [50000, 500000]的单词的表示形式，C2-50k 将单词用子词表示，而 C2-3/500k 则还是用独立的单词。由此可见，BPE算法构成的词库对模型性能非常有帮助。 
        * > Because subword representations are less sparse, reducing the size of the network vocabulary, and representing more words via subword units, can lead to better performance.   
>  ![在这里插入图片描述](http://img-blog.csdnimg.cn/20190515142357523.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly90enV3cGt1LmJsb2cuY3Nkbi5uZXQ=,size_16,color_FFFFFF,t_70#pic_center)

    * Consequently, the WDict baseline performs more poorly for OOVs (9.2% precision; 5.2% recall), and the subword models improve both precision and recall (21.9% precision and 15.6% recall for BPE-J90k). 

####  》结论与贡献

> We discuss the suitability of different word segmentation techniques,
including simple character n-gram models and a segmentation based on the byte
pair encoding compression algorithm, and empirically show that subword models
improve over a back-off dictionary baseline for the WMT 15 translation tasks
English→German and English→Russian by up to 1.1 and 1.3 BLEU, respectively.

Since out-of-vocabulary words, but also rare in-vocabulary words are
translated poorly by word-based model => representing rare and unseen words as
a sequence of subword units = BPE算法

  1. BPE算法 handel languages with productive word formation processes such as agglutination and compounding 
  2. BPE算法 > back-off model 

##  中文的未登录词问题

**中翻英**  
from Nikolov : 中文的但系并不像英文的单词（西方语言）由多个字母形成的语素组成，因此不适合使用BPE算法，因此 Nikolov
等人提出使用五笔先对句子中的词语编码后再输入到 NMT 模型中。

> [ Character-level Chinese-English Translation through ASCII Encoding](http://aclweb.org/anthology/papers/W/W18/W18-6302/) Nikolov., WMT’2018  
>  [ Subword-augmented Embedding for Cloze Reading Comprehension](http://arxiv.org/abs/1806.09103) COLING’2018  
>  [ Achieving Human Parity on Automatic Chinese to English News Translation](http://arxiv.org/abs/1803.05567) [ [ 知乎](http://zhuanlan.zhihu.com/p/34680990) ] | 推敲网络 Micorsoft  
>  [ Pinyin as Subword Unit for Chinese-Sourced Neural Machine Translation](http://doras.dcu.ie/23197/) AICS’2017

**使用了BPE算法的相关研究工作：中文语法错误修正**  
并没有对单词进行五笔编码，而是直接进行BPE算法。

> [ Youdao’s Winning Solution to the NLPCC-2018 Task 2 Challenge: A Neural
Machine Translation Approach to Chinese Grammatical Error Correction](http://tcci.ccf.org.cn/conference/2018/papers/EV39.pdf)  
>  [ A Sequence to Sequence Learning for Chinese Grammatical Error Correction](http://link.springer.com/chapter/10.1007/978-3-319-99501-4_36) | [ [ github](http://github.com/blcu-nlp/NLPCC_2018_TASK2_GEC) ]

##  相关工具

  * [ rsennrich/subword-nmt ](http://github.com/rsennrich/subword-nmt) star911 | [ [ csdn ](http://blog.csdn.net/jmh1996/article/details/89286898) ] 

##  参考资料

Neural Machine Translation of Rare Words with Subword Units

  * [ 机器翻译 bpe——bytes-pair-encoding以及开源项目subword-nmt快速入门 ](http://blog.csdn.net/jmh1996/article/details/89286898) | Icoding_F2014 
  * [ 一文读懂BERT中的WordPiece ](http://www.cnblogs.com/huangyc/p/10223075.html) | 博客园 hyc339408769 
  * [ subword-unit ](http://plmsmile.github.io/2017/10/19/subword-units/) | [ plmsmile@126.com ](mailto:plmsmile@126.com) , PLM’s Notes 
  * [ 【机器翻译】字符级机器翻译 - BPE ](http://blog.eson.org/pub/a8b3f785/) | ESON 
  * github/ [ rsennrich/subword-nmt ](http://github.com/rsennrich/subword-nmt)
  * github/ [ bheinzerling/bpemb ](http://github.com/bheinzerling/bpemb)
  * [ Machine Translation - 07: Open-vocabulary Translation ](http://homepages.inf.ed.ac.uk/rsennric/mt18/7_4up.pdf) | Rico Sennrich, University of Edinburgh 
  * [ 神经网络机器翻译Neural Machine Translation(3): Achieving Open Vocabulary Neural MT ](http://blog.csdn.net/u011414416/article/details/51108193) | clear- 

神经机器翻译模型中对未登录词问题的 **相关工作** [ link](http://rsarxiv.github.io/2016/09/29/PaperWeekly-%E7%AC%AC%E4%B8%83%E6%9C%9F/)

  1. Neural Machine Translation of Rare Words with Subword Units，2016 
  2. A Character-Level Decoder without Explicit Segmentation for Neural Machine Translation，2016 
  3. Achieving Open Vocabulary Neural Machine Translation with Hybrid Word-Character Models，2016 
  4. Character-based Neural Machine Translation，Costa-Jussa, 2016 
  5. Character-based Neural Machine Translation，Ling, 2016 
  6. Fully Character-Level Neural Machine Translation without Explicit Segmentation，ACL’2017 

Sampled softmax

  * [ On Using Very Large Target Vocabulary for Neural Machine Translation ](http://arxiv.org/abs/1412.2007) , Sébastien Jean 2014 被引用509次   
~~主要提出了重要性采样的 Softmax 函数的计算方法（Sampled Softmax），该方法解决了
softmax函数中随着词表大小增加而增加的分母计算量。~~

  * [ 关于sampling softmax 中重要性采样的论文阅读笔记 ](http://blog.csdn.net/wangpeng138375/article/details/75151064) * | wangpeng138375 

* * *

**_只眷恋两小无猜 XD_  
_fivejthree at outlook dot com_ **

