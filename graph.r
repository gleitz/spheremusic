library(ggplot2)

if (!('s' %in% ls())) {
  s <- read.csv('weekly.csv')
  s$visible <- NULL
}
