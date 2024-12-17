const unlockNextLevel = async (nextLevelId) => {
    try {
      const currentProgress = await AsyncStorage.getItem('unlockedLevels');
      let levels = currentProgress ? JSON.parse(currentProgress) : [1];
      
      if (!levels.includes(nextLevelId)) {
        levels.push(nextLevelId);
        await AsyncStorage.setItem('unlockedLevels', JSON.stringify(levels));
        setUnlockedLevels(levels);
      }
    } catch (error) {
      console.error('Failed to unlock next level:', error);
    }
  };
  