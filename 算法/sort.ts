// 冒泡排序
// 1、每次都从第一位置冒泡，因此最多冒泡操作为 n 次
// 2、每次冒泡都会把最大的冒到最上面
// 3、没完成一次冒泡 只需对出去最上面的剩余数组进行冒泡即可
// 4、如果提前冒泡完，则不会出现交换事件 
const PopupSort = (arr: Array<number>) => {
    const len = arr.length
    let switchTime = 0
    for (let i = 0; i < len; i++) {
      let hasSort = false
      console.log(`第${i + 1}轮排序：`, arr)
      switchTime = 0
      for (let j = 0; j < len - i; j++) {
        if (arr[j] > arr[j + 1]) {
          let temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
          console.log(`第${++switchTime}次交换：`, arr)
          hasSort = true
        }
      }
      if (hasSort == false) {
        break
      }
    }
  }
  
  // 选择排序
  // 1、第一次选择一个最小的值 放在数组的最前面
  // 2、后续在剩余数组中再找最小的放在已经排序的末尾
  // 3、最多找n轮
  const SelectSort = (arr: Array<number>) => {
    const len = arr.length
    let switchTime = 0
    for (let i = 0; i < len; i++) {
      console.log(`第${i + 1}轮排序：`, arr)
      switchTime = 0
      let j = i + 1
      while (j < len) {
        if (arr[j] < arr[i]) {
          let temp = arr[i]
          arr[i] = arr[j]
          arr[j] = temp
          console.log(`第${++switchTime}次交换：`, arr)
        }
        j++
      }
    }
  }
  
  // 插入排序
  // 将数组第一个元素当做有序数组，第二个元素作为数组的末尾
  // 插入逻辑
  // 1、取第i个元素，和前方有序数组对比
  // 2、从有序数组末尾开始比较
  // 3、如果大于末尾数组 则和该元素进行交换
  // 4、如果小于比较元素 则比较停止 进入下一轮比较
  // 一共排序 n-1 轮插入
  const InsertSort = (arr: Array<number>) => {
    const len = arr.length
    let switchTime = 0
    if (len <= 1) {
      return
    }
    for (let i = 1; i < len; i++) {
      console.log(`第${i}轮排序：`, arr)
      switchTime = 0
      let j = i
      while (j > 0) {
        if (arr[j] < arr[j - 1]) {
          let temp = arr[j - 1]
          arr[j - 1] = arr[j]
          arr[j] = temp
          console.log(`第${++switchTime}次交换：`, arr)
        } else {
          break
        }
        j--
      }
    }
  }
  
  // 归并排序
  // 1、将数组分为两段，分别对两段进行排序
  // 2、利用递归，不断对各自分开的两个数组进行各自的归并
  // 3、归并原理
  //   1. 新建一个数组
  //   2. 不断插入两个数组的第一个元素 同时删除相应数组的元素，直到其中一个数组为空
  //   3. 将剩余不为空的数组拼接到新建的数组
  const MergeSort = (arr: Array<number>): Array<number> => {
    const mid = arr.length >> 1
    return arr.length < 2 ? arr : merge(MergeSort(arr.slice(0, mid)), MergeSort(arr.slice(mid)))
  }
  
  const merge = (left: Array<number>, right: Array<number>): Array<number> => {
    const mergeArr: Array<number> = []
    while (left.length > 0 && right.length > 0) {
      if (left[0] < right[0]) {
        mergeArr.push(left.shift() as number)
      } else {
        mergeArr.push(right.shift() as number)
      }
    }
    return left.length > 0 ? [...mergeArr, ...left] : [...mergeArr, ...right]
  }
  
  // 快速排序
  // 1、类似于归并，需要进行分区 
  // 2、在数组中寻找一个基准 pivot
  // 3、分区partition 把大的放在基准右边，小的放在基准左边，细节：
  //    1. 实际上是冒泡操作
  //    2. 对基准外的数组进行特殊的冒泡操作，冒泡不和下一个元素比，而是和基准位置的元素比较
  //    3. 冒泡完成后将基准与冒泡停止的位置做交换
  // 4、对基准左右两边的数组分别进行分区操作， 并递归
  const QuickSort = (arr: Array<number>) => {
    partitionSort(arr, 0, arr.length - 1)
  }
  
  const partitionSort = (arr: Array<number>, left: number, right: number) => {
    if (left < right) {
      let pivot = partition(arr, left, right)
      console.log('pivot', pivot)
      partitionSort(arr, left, pivot - 1)
      partitionSort(arr, pivot + 1, right)
    }
  }
  
  const partition = (arr: Array<number>, left: number, right: number): number => {
    let pivot = left
    let index = pivot + 1
    for (let i = index; i <= right; i++) {
      if (arr[i] < arr[pivot]) {
        swap(arr, i, index)
        console.log(arr, i, index)
        index++
      }
    }
    swap(arr, pivot, index - 1)
    return index - 1
  }
  
  const swap = (arr: Array<number>, i: number, j: number) => {
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }