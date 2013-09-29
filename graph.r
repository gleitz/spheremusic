library(ggplot2)

if (!('s' %in% ls())) {
  s <- read.csv('weekly.csv')
  s$timestamp <- as.Date(s$timestamp)
}
p1 <- ggplot(s) + aes(x = longitude, y = latitude) +
  geom_point()
p2 <- ggplot(s) + aes(x = velocity) + geom_histogram() + facet_wrap(~ timestamp)
p3 <- ggplot(s) + aes(x = longitude, y = velocity) + geom_point()
p4 <- ggplot(s) + aes(y = latitude, x = velocity) + geom_point()
