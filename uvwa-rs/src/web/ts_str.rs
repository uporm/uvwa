use serde::ser::SerializeSeq;
use serde::{self, Deserialize, Deserializer, Serializer};
use std::fmt::Display;
use std::str::FromStr;

pub fn to_str<T, S>(x: &T, s: S) -> Result<S::Ok, S::Error>
where
    T: Display,
    S: Serializer,
{
    s.serialize_str(&x.to_string())
}

pub fn to_number<'de, T, D>(d: D) -> Result<T, D::Error>
where
    T: FromStr,
    T::Err: Display,
    D: Deserializer<'de>,
{
    let s = String::deserialize(d)?;
    s.parse::<T>().map_err(serde::de::Error::custom)
}

pub fn vec_to_str<T, S>(x: &Vec<T>, s: S) -> Result<S::Ok, S::Error>
where
    T: Display,
    S: Serializer,
{
    let mut seq = s.serialize_seq(Some(x.len()))?;
    for element in x {
        seq.serialize_element(&element.to_string())?;
    }
    seq.end()
}

pub fn vec_to_number<'de, T, D>(d: D) -> Result<Vec<T>, D::Error>
where
    T: FromStr,
    T::Err: Display,
    D: Deserializer<'de>,
{
    let seq = <Vec<String>>::deserialize(d)?;
    seq.into_iter()
        .map(|s| s.parse::<T>().map_err(serde::de::Error::custom))
        .collect()
}
