package com.adobe.prj.backend.dto.timetable;

import lombok.Getter;
import lombok.ToString;

import java.util.HashMap;
import java.util.Map;

@Getter
@ToString
public enum TimeTableType {
    CLASS("class"),
    EXAM("exam");
    private final String value;
    TimeTableType(String value) {this.value = value;}
    public String getValue() {
        return value;
    }
    public static final Map<String, TimeTableType> typeMap = new HashMap<>();
    static {
        for (TimeTableType timeTableType : TimeTableType.values()) {
            typeMap.put(timeTableType.getValue().toLowerCase(), timeTableType);
        }
    }
    public static TimeTableType fromString(String type) {
        if (type != null) {
            return typeMap.get(type.toLowerCase());
        }
        else {
            return null;
        }
    }
}
