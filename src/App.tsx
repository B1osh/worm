import React, {useEffect, useState} from 'react';
import { View, StyleSheet, Dimensions, PixelRatio, TouchableWithoutFeedback } from 'react-native';

const { width, height } = Dimensions.get('window');
const gridWidth = 12;
const gridHeight = 24;
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
    margin: 2,
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
  const [snakeSpeed, setSnakeSpeed] = useState(100);
  const [touchIn, setTouchIn] = useState(false);
  const [touchLoc, setTouchLoc] = useState([0, 0]);
  const [reachedTouch, setReachedTouch] = useState(false);

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
        width: PixelRatio.roundToNearestPixel(cellSize*w) + 1, 
        height: PixelRatio.roundToNearestPixel(cellSize*h) + 1}
      ]} />);


      previousSegment = currentSegment;
    }
    return snakeViews;
  }

  const moveSnake = () => {
    const newSnake : any[][] = [];
    
    let d = controlSnake();

    let x = snakeCoordinates[0][0];
    let y = snakeCoordinates[0][1];

    if (d === 0) {
      if (x++ >= gridWidth - 1) x = 0;
    } else if (d === 1) {
      if (y++ >= gridHeight - 1) y = 0;
    } else if (d === 2) {
      if (x-- <= 0) x = gridWidth-1;
    } else if (d === 3) {
      if (y-- <= 0) y = gridHeight-1;
    }

    newSnake.push([x,y]);
    for (let i = 0; i < snakeCoordinates.length-1; i++) {
      newSnake.push(snakeCoordinates[i]);
    }

    setSnakeCoordinates(newSnake);
  }
  useEffect(() => {
    const intervalId = setInterval(() => {
      moveSnake();
    }, snakeSpeed);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [snakeCoordinates]);


  const controlSnake = () => {

    const headLocation = snakeCoordinates[0];
    
    if (Math.floor(touchLoc[0]) === headLocation[0] && Math.floor(touchLoc[1]) === headLocation[1]) {
      setReachedTouch(true);
      return direction;
    }
    
    if (!touchIn || reachedTouch) return direction;
    

    const xDif = 0.5 + headLocation[0] - touchLoc[0];
    const yDif = 0.5 + headLocation[1] - touchLoc[1];


    if (Math.abs(xDif) > Math.abs(yDif)) {
      if (xDif > 0 && direction === 0 || xDif < 0 && direction === 2) {
        if (yDif > 0) {
          setDirection(3);
          return 3;
        }else if (yDif < 0) {
          setDirection(1);
          return 1;
        }
      }
      else if (direction === 1 || direction === 3) {
        if (xDif > 0) {
          setDirection(2);
          return 2;
        }else if (xDif < 0) {
          setDirection(0);
          return 0;
        }
      }
    }
    else if (Math.abs(xDif) < Math.abs(yDif)) {
      if (yDif > 0 && direction === 1 || yDif < 0 && direction === 3) {
        if (xDif > 0) {
          setDirection(2);
          return 2
        }else if (xDif < 0) {
          setDirection(0);
          return 0
        }
      }
      else if (direction === 0 || direction === 2) {
        if (yDif > 0) {
          setDirection(3);
          return 3;
        }else if (yDif < 0) {
          setDirection(1);
          return 1;
        }
      }
    }
    
    return direction;
  };

  const handlePressIn = (event) => {
    if (touchIn) return;
    const {locationX, locationY} = event.nativeEvent
    setTouchLoc([locationX/cellSize, locationY/cellSize]);
    setTouchIn(true);
  };

  const handlePressOut = () => {
    setTouchIn(false);
    setReachedTouch(false);
  }

  const handlePressMove = (event) => {
    const {locationX, locationY} = event.nativeEvent
    setTouchLoc([locationX/cellSize, locationY/cellSize]);
  }
  

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback>
        <View style={styles.field}  onTouchStart={handlePressIn} onTouchEnd={handlePressOut} onTouchMove={handlePressMove}>
        {renderSnake(snakeCoordinates)}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default SnakeApp;
