# config module specific ProGuard rules here.

# 允许混淆类名、方法名、字段名
# 不要用 -keep 保留任何类或成员

# 优化代码
-optimizationpasses 10
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-dontskipnonpubliclibraryclassmembers
-verbose

# 允许删除无用代码和资源
-dontpreverify
-allowaccessmodification
-optimizations !code/simplification/arithmetic,!field/*,!class/merging/*

# 混淆配置（允许最大程度缩短）
-renamesourcefileattribute SourceFile
-keepattributes SourceFile,LineNumberTable

# 移除调试信息
# -dontnote
# -dontwarn
# -dontoptimize

# 下面这些规则都是可以删减保留的，你可以根据需求调整
# 允许混淆但保留序列化ID（如果用到了序列化）
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object readResolve();
    java.lang.Object writeReplace();
}

# 关闭混淆时保留的注解
-keepattributes *Annotation*

# 允许混淆内部类
-keepattributes InnerClasses

# 允许最大限度删除未用代码
-dontwarn **