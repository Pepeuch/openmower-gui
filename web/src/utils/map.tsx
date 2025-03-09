import { Quaternion } from "../types/ros.ts";
import  Converter  from "usng.js";

export var converter = new Converter({});
export const EARTH_RADIUS = 6371008.8; // Rayon de la Terre en mètres
export const PI = Math.PI;

/**
 * Convertit un angle en quaternion.
 * @param heading Angle en radians.
 * @returns Quaternion correspondant.
 */
export function getQuaternionFromHeading(heading: number): Quaternion {
  return {
    X: 0,
    Y: 0,
    Z: Math.sin(heading / 2),
    W: Math.cos(heading / 2),
  };
}

/**
 * Génère une ligne en fonction de l'orientation.
 * @param offsetX Décalage en X.
 * @param offsetY Décalage en Y.
 * @param datum Point de référence [lat, lon, zone UTM].
 * @param y Coordonnée Y.
 * @param x Coordonnée X.
 * @param orientation Angle en radians.
 * @returns Coordonnées transformées.
 */
export function drawLine(
  offsetX: number,
  offsetY: number,
  datum: [number, number, number],
  y: number,
  x: number,
  orientation: number
): [number, number] {
  return transpose(offsetX, offsetY, datum, y + Math.sin(orientation), x + Math.cos(orientation));
}

/**
 * Transforme des coordonnées UTM en coordonnées géographiques.
 * @param offsetX Décalage en X.
 * @param offsetY Décalage en Y.
 * @param datum Point de référence [lat, lon, zone UTM].
 * @param y Coordonnée Y.
 * @param x Coordonnée X.
 * @returns Coordonnées [longitude, latitude].
 */
export function transpose(
  offsetX: number,
  offsetY: number,
  datum: [number, number, number],
  y: number,
  x: number
): [number, number] {
  const { lon, lat } = converter.UTMtoLL(datum[1] + y + offsetY, datum[0] + x + offsetX, datum[2]);
  return [lon, lat];
}

/**
 * Transforme des coordonnées géographiques en coordonnées UTM.
 * @param offsetX Décalage en X.
 * @param offsetY Décalage en Y.
 * @param datum Point de référence [lat, lon, zone UTM].
 * @param y Latitude.
 * @param x Longitude.
 * @returns Coordonnées transformées [X, Y].
 */
export function itranspose(
  offsetX: number,
  offsetY: number,
  datum: [number, number, number],
  y: number,
  x: number
): [number, number] {
  const coords: [number, number, number] = [0, 0, 0];
  converter.LLtoUTM(y, x, coords);
  return [coords[0] - datum[0] - offsetX, coords[1] - datum[1] - offsetY];
}
