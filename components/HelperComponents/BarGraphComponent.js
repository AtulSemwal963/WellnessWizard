import {View,Text,StyleSheet} from 'react-native';

const BarGraph = ({
  data,
  barColor = theme,
  goal,
  goalUnit
}) => {
  // Find the max value in the dataset to scale the bars
  const yAxisLabels = [100,80,60,40,20,0]; // Generate Y-axis labels (e.g., [100, 80, 60, 40, 20, 0])
  const reversedData = [...data.graphData].reverse();
  // const reversedData = [
  //   {value:300},
  //   {value:1200},
  //   {value:400},
  //   {value:1500},
  //   {value:2000},
  //   {value:1250},
  //   {value:700}
  // ];

  const reversedLabels = [...data.labels].reverse();
  return (
    <View style={[styles.container]}>
      {/* Y-Axis Labels */}
      <View style={styles.yAxis}>
        {yAxisLabels.map((label, index) => (
          
          <Text key={index} style={[styles.yAxisLabel,label==0 && {opacity:0}]}>
            {label+"%"}
          </Text>
        ))}
      </View>
  
      {/* Graph */}
      <View style={styles.graphContainer}>
        <View style={styles.graph}>
          {reversedData.map((value, index) => {
            let barHeight 
            if(goalUnit=='Litres' || goalUnit=="Ounces") barHeight=((value.value/(goal*1000))*100);
            else barHeight=(((value.value/goal))*100)
            console.log("Value at "+index+" = "+barHeight) // Scale bar height
            return (
              <View key={index} style={styles.barContainer}>
                {/* Bar */}
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight+"%",
                      backgroundColor: barColor,
                      elevation: 3,
                      borderRadius: 9999,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
  
        {/* X-Axis Labels */}
        <View style={styles.xAxis}>
          {data.labels.map((label, index) => (
            <Text key={index} style={styles.xAxisLabel}>
              {label}
            </Text>
          ))}
        </View>
      </View>
      
    </View>
  );
};

export default BarGraph;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: "1%",
    marginHorizontal: 10,
    height:"60%",
    width:"100%"
  },
  yAxis: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: "100%",
    paddingRight: 5,
  },
  yAxisLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontFamily:"Gabarito-SemiBold"
  },
  graphContainer: {
    flex: 1,
    height:"100%",
    alignItems: "center",
  },
  graph: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    width: "100%",
    height: "100%",
    borderBottomWidth: 2,
    borderColor: "#ccc",
  },
  barContainer: {
    alignItems: "center",
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 5,
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 5,
  },
  xAxisLabel: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b7280",
    flex: 1,
    fontFamily:"Gabarito-SemiBold"
  },
});