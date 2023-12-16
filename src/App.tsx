import React, {useEffect, useState} from 'react';
import { View, StyleSheet, Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');
const gridWidth = 8;
const gridHeight = 16;
const cellSize = Math.min(width / (gridWidth+1.1), height / (gridHeight+1.1));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  field: {
    width: (gridWidth+0.5)*cellSize,
    height: (gridHeight+0.5)*cellSize,
    backgroundColor: '#111111',
    borderWidth: cellSize/4,
    borderColor: 'red'
  },
  cell: {
    width: PixelRatio.roundToNearestPixel(cellSize),
    height: PixelRatio.roundToNearestPixel(cellSize),
    position: 'absolute',
    backgroundColor: 'green',
  },
});

const SnakeApp = () => {
  const [snakeCoordinates, setSnakeCoordinates] = useState([
    [0, 0],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 4],
    [3, 4],
    [3, 5],
    [3, 6],
    [3, 7],
  ]);
  const [direction, setDirection] = useState(1);

  const renderSnake = (snakeCoordinates) => {
    const snakeViews : any[] = [];


    let previousSegment = snakeCoordinates[0];
    let currentSegment = previousSegment;
    snakeViews.push(<View key = {0} style={[styles.cell, {left:currentSegment[0] * cellSize, top:currentSegment[1] * cellSize}]} />);
    for (let i = 1; i < snakeCoordinates.length; i++) {
      currentSegment = snakeCoordinates[i];

      let w = 1, h = 1;
      let x = 0.1, y = 0.1;
      if (previousSegment[1] === currentSegment[1]) {
        h = 0.8;
      } else {
        w = 0.8;
      } 

      if (previousSegment[0] < currentSegment[0]) {
        x *= -1;
      } else if (previousSegment[1] < currentSegment[1]) {
        y *= -1;
      }


      snakeViews.push(<View key = {i} style={[styles.cell, {
        left: PixelRatio.roundToNearestPixel((currentSegment[0] + x) * cellSize), 
        top: PixelRatio.roundToNearestPixel((currentSegment[1] + y) * cellSize), 
        width: PixelRatio.roundToNearestPixel(cellSize*w), 
        height: PixelRatio.roundToNearestPixel(cellSize*h)}
      ]} />);


      previousSegment = currentSegment;
    }
    return snakeViews;
  }

  const moveSnake = () => {
    const newSnake : any[][] = [];
    
    let x = snakeCoordinates[0][0], y = snakeCoordinates[0][1];

    if (direction === 0) {
      if (x++ >= gridWidth - 1) x = 0;
    } else if (direction === 1) {
      if (y++ >= gridHeight - 1) y = 0;
    } else if (direction === 2) {
      if (x-- < 0) x = gridWidth-1;
    } else if (direction === 3) {
      if (y-- < 0) y = gridHeight-1;
    }

    newSnake.push([x,y]);
    for (let i = 0; i < snakeCoordinates.length-1; i++) {
      newSnake.push(snakeCoordinates[i]);
    }

    setSnakeCoordinates(newSnake);
  }


  useEffect(() => {
    // Set up an interval to move the snake every second
    const intervalId = setInterval(() => {
      moveSnake();
    }, 1000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [snakeCoordinates]);

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        {renderSnake(snakeCoordinates)}
      </View>
    </View>
  );
};

export default SnakeApp;
