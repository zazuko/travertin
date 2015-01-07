<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:alod="http://data.admin.ch/alod/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:locah="http://data.archiveshub.ac.uk/def/"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <!-- skip unwanted text and attribute nodes -->
    <xsl:template match="text()|@*"></xsl:template>

    <xsl:template match="//c02">
        <rdf:Description>
            <xsl:attribute name="rdf:about">
                <xsl:text>http://data.admin.ch/</xsl:text>
                <xsl:value-of select="./did/unitid" />
            </xsl:attribute>

            <dc:title>
                <xsl:value-of select="./did/unittitle" />
            </dc:title>

            <locah:level>
                <xsl:value-of select="../@otherlevel" />
            </locah:level>

            <alod:recordID>
                <xsl:value-of select="./did/unitid" />
            </alod:recordID>
        </rdf:Description>
    </xsl:template>

    <!-- start at the root and add a wrapper element -->
    <xsl:template match="/">
        <rdf:RDF>
            <xsl:apply-templates />
        </rdf:RDF>
    </xsl:template>
</xsl:stylesheet>