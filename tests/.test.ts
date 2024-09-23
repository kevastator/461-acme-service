import { getCorrectness } from '../src/correctness'
import { getLicense } from '../src/license'
import { getBusFactor } from '../src/bus_factor'
import { getResponsive } from '../src/responsive_maintainer'
import { calculateTotalTimeFromRepo } from '../src/ramp_up_metric';
import {parseURL} from '../src/url_parse';
import { graphqlRequest } from "../src/graphql_request";
import logger from "../src/logger";
import path from "path"

describe('Test Suite', () => {

    const owner = "kevastator";
    const repo = "461-acme-service";
    const urlrl = "https://github.com/kevastator/461-acme-service";
    const githubkey = process.env.GITHUB_TOKEN || '';

    it('BusFactor for Our Repo', async () => {
        const busfactor = await getBusFactor(owner, repo);
        expect(busfactor[0]).toBeGreaterThanOrEqual(0);
        expect(busfactor[1]).toBeGreaterThanOrEqual(0);
    });
  
    it('Correctness for Our Repo', async () => {
        const correctness = await getCorrectness(owner, repo);
        expect(correctness[0]).toBeGreaterThanOrEqual(0);
        expect(correctness[1]).toBeGreaterThanOrEqual(0);
    });

    it('License for Our Repo', async () => {
        const license = await getLicense(owner, repo);
        expect(license[0]).toBeGreaterThanOrEqual(0);
        expect(license[1]).toBeGreaterThanOrEqual(0);
    });

    it('Rampup time for Our Repo', async () => {
        const rampup  = await calculateTotalTimeFromRepo(urlrl);
        expect(rampup[0]).toBeGreaterThanOrEqual(0);
        expect(rampup[1]).toBeGreaterThanOrEqual(0);
    });

    it('Responsiveness for Our Repo', async () => {
        const responsiveness = await getResponsive(owner, repo);
        expect(responsiveness[0]).toBeGreaterThanOrEqual(0);
        expect(responsiveness[1]).toBeGreaterThanOrEqual(0);
    });

    it('Parse URL', async () => {
        const names = await parseURL(urlrl);
        expect(names[0]).toBe('kevastator');
        expect(names[1]).toBe('461-acme-service');
    });

    const owner2 = "kevastator";
    const repo2 = "461-acme-service";
    const url2 = "https://github.com/kevastator/461-acme-service";


    it('BusFactor for Our Repo', async () => {
        const busfactor = await getBusFactor(owner2, repo2);
        expect(busfactor[0]).toBeGreaterThanOrEqual(0);
        expect(busfactor[1]).toBeGreaterThanOrEqual(0);
    });
  
    it('Correctness for Our Repo', async () => {
        const correctness = await getCorrectness(owner2, repo2);
        expect(correctness[0]).toBeGreaterThanOrEqual(0);
        expect(correctness[1]).toBeGreaterThanOrEqual(0);
    });

    it('License for Our Repo', async () => {
        const license = await getLicense(owner2, repo2);
        expect(license[0]).toBeGreaterThanOrEqual(0);
        expect(license[1]).toBeGreaterThanOrEqual(0);
    });

    it('Rampup time for Our Repo', async () => {
        const rampup  = await calculateTotalTimeFromRepo(url2);
        expect(rampup[0]).toBeGreaterThanOrEqual(0);
        expect(rampup[1]).toBeGreaterThanOrEqual(0);
    });

    it('Responsiveness for Our Repo', async () => {
        const responsiveness = await getResponsive(owner2, repo2);
        expect(responsiveness[0]).toBeGreaterThanOrEqual(0);
        expect(responsiveness[1]).toBeGreaterThanOrEqual(0);
    });

    const owner3 = "kevastator";
    const repo3 = "461-acme-service";
    const url3 = "https://github.com/kevastator/461-acme-service";

    it('BusFactor for Our Repo', async () => {
        const busfactor = await getBusFactor(owner3, repo3);
        expect(busfactor[0]).toBeGreaterThanOrEqual(0);
        expect(busfactor[1]).toBeGreaterThanOrEqual(0);
    });
  
    it('Correctness for Our Repo', async () => {
        const correctness = await getCorrectness(owner3, repo3);
        expect(correctness[0]).toBeGreaterThanOrEqual(0);
        expect(correctness[1]).toBeGreaterThanOrEqual(0);
    });

    it('License for Our Repo', async () => {
        const license = await getLicense(owner3, repo3);
        expect(license[0]).toBeGreaterThanOrEqual(0);
        expect(license[1]).toBeGreaterThanOrEqual(0);
    });

    it('Rampup time for Our Repo', async () => {
        const rampup  = await calculateTotalTimeFromRepo(url3);
        expect(rampup[0]).toBeGreaterThanOrEqual(0);
        expect(rampup[1]).toBeGreaterThanOrEqual(0);
    });

    it('Responsiveness for Our Repo', async () => {
        const responsiveness = await getResponsive(owner3, repo3);
        expect(responsiveness[0]).toBeGreaterThanOrEqual(0);
        expect(responsiveness[1]).toBeGreaterThanOrEqual(0);
    });

    const owner4 = "kevastator";
    const repo4 = "461-acme-service";
    const url4 = "https://github.com/kevastator/461-acme-service";

    it('BusFactor for Our Repo', async () => {
        const busfactor = await getBusFactor(owner4, repo4);
        expect(busfactor[0]).toBeGreaterThanOrEqual(0);
        expect(busfactor[1]).toBeGreaterThanOrEqual(0);
    });
  
    it('Correctness for Our Repo', async () => {
        const correctness = await getCorrectness(owner4, repo4);
        expect(correctness[0]).toBeGreaterThanOrEqual(0);
        expect(correctness[1]).toBeGreaterThanOrEqual(0);
    });

    it('License for Our Repo', async () => {
        const license = await getLicense(owner4, repo4);
        expect(license[0]).toBeGreaterThanOrEqual(0);
        expect(license[1]).toBeGreaterThanOrEqual(0);
    });

    it('Rampup time for Our Repo', async () => {
        const rampup  = await calculateTotalTimeFromRepo(url4);
        expect(rampup[0]).toBeGreaterThanOrEqual(0);
        expect(rampup[1]).toBeGreaterThanOrEqual(0);
    });

    it('Responsiveness for Our Repo', async () => {
        const responsiveness = await getResponsive(owner4, repo4);
        expect(responsiveness[0]).toBeGreaterThanOrEqual(0);
        expect(responsiveness[1]).toBeGreaterThanOrEqual(0);
    });
});