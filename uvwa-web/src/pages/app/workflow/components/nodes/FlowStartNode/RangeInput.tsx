import React from 'react';
import {Input} from 'antd';

interface RangeInputProps {
    value?: string;
    onChange?: (value: string) => void;
    style?: React.CSSProperties;
}

export const RangeInput: React.FC<RangeInputProps> = ({
                                                          value,
                                                          onChange,
                                                          style,
                                                      }) => {
    const [minValue, maxValue] = value ? value.split(',') : ['', ''];

    const handleChange = (min: string, max: string) => {
        onChange?.(`${min},${max}`);
    };

    return (
        <Input.Group compact style={style}>
            <Input
                style={{width: '50%'}}
                placeholder="最小值"
                value={minValue}
                onChange={(e) => handleChange(e.target.value, maxValue)}
            />
            <Input
                style={{width: '50%'}}
                placeholder="最大值"
                value={maxValue}
                onChange={(e) => handleChange(minValue, e.target.value)}
            />
        </Input.Group>
    );
};