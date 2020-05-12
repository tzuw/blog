---
layout: post
title: "Python threading 模塊帶範例"
subtitle: "Python threading module with examples"
date: 2020-05-11 16:23:00
catalog: true
author: "tzuw"
header-img:  "img/cement.png"
tags: [thread, lock, Semaphore, Python, 软件开发]
categories: [软件开发]
---

之前剛好用到了 Python 的多線程模塊。一直有一個模糊的印象，大概有三種 threading、multiprocessing、concurrent.futures ...... 等，趁這個機會來把相關的知識點整理整理。首先，釐清一個觀念，Python 中雖然有 GIL 去讓每次只有一個執行緒在跑，但是 Python 它不是 thread-free 的，比如常見的累加操作 ```+=1``` 就不是 atomic 的。然後，按部就班地先來看如何定義 Python 中的一個線程吧。



### 先備知識 - 定義一個線程

線程，指的是作業系統處理工作的基本單元。作業系統會根據 Thread 的優先權，以及使用過的 CPU 時間，在不同的 Thread 之間切換，讓各個 Thread 都有執行的機會。而同一個 Process 下的 Thread 使用相同的內存空間，共享全局變量、記憶體。而這些 Thread 又擁有自己的 Stack。即，可以通過參照獲取相同的物件，但是局部變量 (local variable) 獨立。

```python
import threading

def function(i):
    print ("function called by thread %i\n" % i)
    return

threads = []
for i in range(5):
    t = threading.Thread(target=function , args=(i, ))
    threads.append(t)
    t.start()
    t.join()
```

```
Output:
function called by thread 0

function called by thread 1

function called by thread 2

function called by thread 3

function called by thread 4

```

上面利用了 ```threading.Thread(target=function)``` 定義了線程，並且使用 join() 使得每個線程執行結束後才會進行接下去的迴圈。除此之外，你也可以自己定義一個線程類繼承至 ```Thread ```並實現 __ init __ 和 run 方法，同樣可以使用 ```start()``` 方法來開始一個線程，這邊就不展開啦。



### 什麼是線程同步 Synchronous

線程同步描述的是，線程之間在共享資源時的存取規則，即有一個線程在對某個**共享變量**進行讀寫時，其他線程將被阻塞，知道上一個線程釋放了鎖。(按預定的先後順序執行) 它預防了**死鎖**、異常線程順序的發生。

```shared_resource_lock = threading.Lock()``` 、```lock = threading.RLock()``` 、 ```semaphore = threading.Semaphore(0)```、 ```condition = Condition()``` 、```event = Event()``` 、```Queue```  ，這些鎖們都可以用來實現線程同步。它們分別是，鎖 Lock、遞歸鎖 Reentrant Lock (RLock)、信號量 Semaphore、條件 Condition、事件 Event。

此外，使用 ```with``` 語句。



**# Reentrant Lock 遞歸鎖/重入锁**

```python
# Reentrant Lock Example 遞歸鎖/重入锁
# 只有放鎖的人可以解鎖。解鈴還須繫鈴人。並且，同一個線程可以獲取多次這個 RLock。當然，同時也要釋放多次。
# 實現一個往箱子裡放/取 item 的多線程程式。只有把東西放進去的人，將鎖釋放後，才可以有人把東西拿出來。

import threading
import time
class Box():
    lock = threading.RLock()
    def __init__(self):
        self.total_items = 0
    def execute(self, n):
        Box.lock.acquire() # 第二次獲取鎖
        self.total_items += n # manipulate total_items synchronously
        Box.lock.release() # 第一次釋放鎖
    def add(self):
        while not Box.lock.acquire(blocking=False):
            print ('add is waiting for lock being released')
        print("adding 1 item in the box")
        self.execute(1)
        Box.lock.release()
    def remove(self):
        while self.total_items == 0:
            print ('Nothing to remove.')
        while not Box.lock.acquire(blocking=False):
            print ('remove is waiting for lock being released')
        print("removing 1 item in the box", self.total_items)
        self.execute(-1)
        Box.lock.release()

def adder(box, items):
    while items > 0:
        box.add()
        time.sleep(1)
        items -= 1
        
def remover(box, items):
    while items > 0:
        box.remove()
        time.sleep(1)
        items -= 1
        
if __name__ == "__main__":
    items = 5
    print("putting %s items in the box " % items)
    box = Box()
    t1 = threading.Thread(target=adder, args=(box, items))
    t2 = threading.Thread(target=remover, args=(box, items))
    t1.start()
    t2.start()
    t1.join()
    t2.join()
    print("%s items still remain in the box " % box.total_items)

```

```
Output:
putting 5 items in the box
adding 1 item in the box
removing 1 item in the box 1
adding 1 item in the box
removing 1 item in the box 1
adding 1 item in the box
Nothing to remove.
removing 1 item in the box 1
adding 1 item in the box
removing 1 item in the box 1
adding 1 item in the box
removing 1 item in the box 1
0 items still remain in the box
```



**# threading.Semaphore 信號量**

```python
# threading.Semaphore 信號量
# 信號量標明了一個共享資源可以有多少並發存取
# 當信號量=1時，可以作為一個互斥量。即實現資源的互斥訪問。
# 實現一個信號量標示箱子裡還有多少 item 可以被使用，比如這個 item 可以被用來對某網站進行爬蟲

import threading
import random
import time
semaphore = threading.Semaphore(3)
order = 0
def crawler():
    # thread function
    global order
    with semaphore:
        time.sleep(2)
        order +=1
        print('{} is crawlering on {}th url'.format(
                threading.currentThread().getName(), order))
        time.sleep(2)
        
Threads = []
for i in range(10):
    t = threading.Thread(target=crawler)
    Threads.append(t)
    t.start()
    
for t in Threads:
    t.join()
    
print('Spider end.')

```



```
Output:
Thread-6 is crawlering on 1th url
Thread-5 is crawlering on 2th url
Thread-7 is crawlering on 3th url
Thread-9 is crawlering on 4th url
Thread-8 is crawlering on 5th url
Thread-10 is crawlering on 6th url
Thread-11 is crawlering on 7th url
Thread-12 is crawlering on 8th url
Thread-13 is crawlering on 9th url
Thread-14 is crawlering on 10th url
```



**# Condition**

注意，```condition.wait()``` 、```condition.notify()``` 、```condition.acquire()``` 、```condition.release()``` 的使用，和關於線程的面試題。（按照順序打印 ABC 10次）

```python
# 使用條件 Condition
# 解釋 Condition 同步機制可以用緩存，一個生產者-消費者機制的體現。
# 只要緩存沒滿的時候，生產者持續寫入。
# 只要緩存非空，消費者就不停的吃。
# 所以，當緩存隊列不為空時，生產者通知消費者。當緩存隊列不滿的時候，消費者通知生產者。
# 下面這段代碼是一個生產 20 個，然後消耗 20 個的例子。

https://python-parallel-programmning-cookbook.readthedocs.io/zh_CN/latest/chapter2/09_Thread_synchronization_with_a_condition.html

```



**# Event**

注意，```event.wait()``` 、```event.set()``` 、```event.clear()```  的使用。

```python
# 使用事件 Event
# 也可以用生產者-消費者作為例子
# 在 event.set() 的時候會通知消費者的 event.wait()，啟動消費。然後，將事件清除。event.clear()

```



### 評估

如果把多線程寫好了，但是卻跑的沒有別人寫得快，那情何以堪，所以自己進行評估就很重要了。講到 Python 中的多線程效能評估，就不得不提到 Python 中的 GIL (Global Interpreter Lock)。所以，這邊主要分為兩個部分介紹，**Python 中的 GIL** 和**如何評估 Python 的多線程程式效能**。



*In CPython, the global interpreter lock, or GIL, is a mutex that prevents multiple native threads from executing Python bytecodes at once. This lock is necessary mainly because CPython’s memory management is not thread-safe. (However, since the GIL exists, other features have grown to depend on the guarantees that it enforces.)*



上面是官方對 GIL 的解釋。可以理解為：在其中一個 Python 解析器 CPython 中，GIL 是一個互斥鎖，它避免了多個執行緒能同時執行 Python 的源碼。它使得：當有一個執行緒在執行 Python，其他 N 個執行緒都在睡覺或是等待 I/O。想到這裡，就可以想到：第一，Python 的 GIL 的由來和設計；第二，Python 的解釋器如何切換執行緒的執行。第三，如何判斷 Python 中的函數是不是 thread-free 的。



(1) 由來：

由于CPython实现的内存管理不是线程安全，所以需要。它阻止了不同的線程並發的訪問 Python 對象。



(1.1) 如何切換：

有兩種方式，第一種是 **Preemptive (先佔式) MultiTasking**，Python2中若一個執行緒沒有直譯 1000 個 bytecode 指令該執行緒就會釋放 GIL 給其他執行需使用。Python3 中則是通過執行緒的使用時間，沒有超過 15ms 就結束了的話，就會被釋放給其他的執行緒。第二種是 **Cooperative (協調式) multitasking**，即當執行緒被網路 I/O 阻擋時，它會將 GIL 釋放，讓其他執行緒可以執行。所以，兩個執行緒就可以同時等待網絡連接。



(2) 如何評估：

1.  使用 time.time()
2.  使用 perf 套件，```python -m perf timeit ' XXX '```



(3) 如何判斷 Python 中的函數是不是 thread-free 的？

通過 dis 模塊來查看 bytecode，查看是不是在賦值對象的時候有可能被打斷。





### 參考資料

1.  [https://stackoverflow.com/questions/22885775/what-is-the-difference-between-lock-and-rlock](https://stackoverflow.com/questions/22885775/what-is-the-difference-between-lock-and-rlock)
2.  [python-parallel-programmning-cookbook](https://python-parallel-programmning-cookbook.readthedocs.io/zh_CN/latest/chapter2/09_Thread_synchronization_with_a_condition.html)
3.  [12.9 Python的全局锁问题](https://python3-cookbook.readthedocs.io/zh_CN/latest/c12/p09_dealing_with_gil_stop_worring_about_it.html)
4.  [Python的GIL是什么鬼，多线程性能究竟如何](http://cenalulu.github.io/python/gil-in-python/)
5.  [深入 GIL: 如何寫出快速且 thread-safe 的 Python – Grok the GIL: How to write fast and thread-safe Python](https://blog.louie.lu/2017/05/19/%E6%B7%B1%E5%85%A5-gil-%E5%A6%82%E4%BD%95%E5%AF%AB%E5%87%BA%E5%BF%AB%E9%80%9F%E4%B8%94-thread-safe-%E7%9A%84-python-grok-the-gil-how-to-write-fast-and-thread-safe-python/)
6.  [concurrent.futures — 創立非同步任務 — 你所不知道的 Python 標準函式庫用法 06](https://blog.louie.lu/2017/08/01/%E4%BD%A0%E6%89%80%E4%B8%8D%E7%9F%A5%E9%81%93%E7%9A%84-python-%E6%A8%99%E6%BA%96%E5%87%BD%E5%BC%8F%E5%BA%AB%E7%94%A8%E6%B3%95-06-concurrent-futures/)



### 延伸閱讀

1.  [https://python3-cookbook.readthedocs.io/zh_CN/latest/preface.html](https://python3-cookbook.readthedocs.io/zh_CN/latest/preface.html)
2.  [Understanding Threading in Python](https://linuxgazette.net/107/pai.html) 推薦
3.  [Inside the Python GIL](http://www.dabeaz.com/python/GIL.pdf)
4.  [官方wiki](https://wiki.python.org/moin/GlobalInterpreterLock)
5.  [Python Parallel Programming Cookbook- Second Edition](https://www.tenlong.com.tw/products/9781789533736)
6.  [Concurrency與Parallelism的不同之處](https://medium.com/mr-efacani-teatime/concurrency%E8%88%87parallelism%E7%9A%84%E4%B8%8D%E5%90%8C%E4%B9%8B%E8%99%95-1b212a020e30)
7.  [Python 的 concurrency 和 parallelization](https://medium.com/@alan81920/python-%E7%9A%84-concurrency-%E5%92%8C-parallelization-efeddcb30c4c)

