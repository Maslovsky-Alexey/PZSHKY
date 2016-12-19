using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Lucene.Net;
using Lucene.Net.Store;
using Lucene.Net.Index;
using System.IO;
using Lucene.Net.Search;
using Lucene.Net.Documents;
using ElectronicSchem.Models.ElectronicSchemModels.Posts;
using Lucene.Net.Analysis.Standard;
using Lucene.Net.QueryParsers;

namespace ElectronicSchem
{
    public static class LuceneSearch
    {
        private static string luceneDirectory = Path.Combine(HttpContext.Current.Request.PhysicalApplicationPath, "lucene_index");
        private static FSDirectory directoryTemp;

        private static FSDirectory directory
        {
            get
            {
                if (directoryTemp == null)
                    directoryTemp = FSDirectory.Open(new DirectoryInfo(luceneDirectory));

                if (IndexWriter.IsLocked(directoryTemp))
                    IndexWriter.Unlock(directoryTemp);

                var lockFilePath = Path.Combine(luceneDirectory, "write.lock");

                if (File.Exists(lockFilePath))
                    File.Delete(lockFilePath);

                return directoryTemp;
            }
        }

        private static void AddPostToLuceneIndex(PostModel post, IndexWriter writer)
        {
            // remove older index entry
            var searchQuery = new TermQuery(new Term("Id", post.ID.ToString()));
            writer.DeleteDocuments(searchQuery);

            // add new index entry
            var doc = new Document();

            // add lucene fields mapped to db fields
            doc.Add(new Field("Id", post.ID.ToString(), Field.Store.YES, Field.Index.NOT_ANALYZED));
            doc.Add(new Field("Title", post.Title, Field.Store.YES, Field.Index.ANALYZED));
            doc.Add(new Field("Discription", post.Discription, Field.Store.YES, Field.Index.ANALYZED));

            // add entry to index
            writer.AddDocument(doc);
        }

        public static void AddListPostsToLuceneIndex(IEnumerable<PostModel> listPosts)
        {
            // init lucene
            var analyzer = new StandardAnalyzer(Lucene.Net.Util.Version.LUCENE_30);

            using (var writer = new IndexWriter(directory, analyzer, IndexWriter.MaxFieldLength.UNLIMITED))
            {
                // add data to lucene search index (replaces older entry if any)

                foreach (var sampleData in listPosts)
                    AddPostToLuceneIndex(sampleData, writer);

                // close handles
                analyzer.Close();
                writer.Dispose();
            }

        }

        public static void AddPostToLuceneIndex(PostModel post)
        {
            AddListPostsToLuceneIndex(new PostModel[] { post });
        }

        public static void ClearLuceneIndexRecord(long recordId)
        {
            // init lucene
            var analyzer = new StandardAnalyzer(Lucene.Net.Util.Version.LUCENE_30);

            using (var writer = new IndexWriter(directory, analyzer, IndexWriter.MaxFieldLength.UNLIMITED))
            {
                // remove older index entry
                var searchQuery = new TermQuery(new Term("Id", recordId.ToString()));
                writer.DeleteDocuments(searchQuery);

                // close handles
                analyzer.Close();
                writer.Dispose();
            }
        }

        public static bool ClearLuceneIndex()
        {
            try
            {
                RemoveAllLuceneIndexes();
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        private static void RemoveAllLuceneIndexes()
        {
            var analyzer = new StandardAnalyzer(Lucene.Net.Util.Version.LUCENE_30);

            using (var writer = new IndexWriter(directory, analyzer, true, IndexWriter.MaxFieldLength.UNLIMITED))
            {
                // remove older index entries
                writer.DeleteAll();

                // close handles
                analyzer.Close();
                writer.Dispose();
            }
        }

        public static void Optimize()
        {
            var analyzer = new StandardAnalyzer(Lucene.Net.Util.Version.LUCENE_30);
            using (var writer = new IndexWriter(directory, analyzer, IndexWriter.MaxFieldLength.UNLIMITED))
            {
                analyzer.Close();
                writer.Optimize();
                writer.Dispose();
            }
        }

        private static PostModel MapLuceneDocumentToData(Document doc)
        {
            return new PostModel
            {
                ID = Convert.ToInt32(doc.Get("Id")),
                Title = doc.Get("Title"),
                Discription = doc.Get("Discription")
            };
        }

        private static IEnumerable<PostModel> MapLuceneToDataList(IEnumerable<Document> hits)
        {
            return hits.Select(MapLuceneDocumentToData).ToList();
        }

        private static IEnumerable<PostModel> MapLuceneToDataList(IEnumerable<ScoreDoc> hits,
            IndexSearcher searcher)
        {
            return hits.Select(hit => MapLuceneDocumentToData(searcher.Doc(hit.Doc))).ToList();
        }

        private static Query ParseQuery(string searchQuery, QueryParser parser)
        {
            Query query;

            try
            {
                query = parser.Parse(searchQuery.Trim());
            }
            catch (ParseException)
            {
                query = parser.Parse(QueryParser.Escape(searchQuery.Trim()));
            }

            return query;
        }

        private static IEnumerable<PostModel> Search(string searchQuery, string searchField = "")
        {
            // validation
            if (string.IsNullOrEmpty(searchQuery.Replace("*", "").Replace("?", "")))
                return new List<PostModel>();

            // set up lucene searcher
            using (var searcher = new IndexSearcher(directory, false))
            {
                var hits_limit = 1000;
                var analyzer = new StandardAnalyzer(Lucene.Net.Util.Version.LUCENE_30);

                if (!string.IsNullOrEmpty(searchField))
                    return SearchBySingleField(searchQuery, searchField, analyzer, hits_limit, searcher);
                else        
                    return SearchByMultipleFields(searchQuery, analyzer, hits_limit, searcher);               
            }
        }

        private static IEnumerable<PostModel> SearchBySingleField(string searchQuery, string searchField, StandardAnalyzer analyzer, int hits_limit, IndexSearcher searcher)
        {
            var parser = new QueryParser(Lucene.Net.Util.Version.LUCENE_30, searchField, analyzer);
            var query = ParseQuery(searchQuery, parser);
            var hits = searcher.Search(query, hits_limit).ScoreDocs;
            var results = MapLuceneToDataList(hits, searcher);
            analyzer.Close();
            searcher.Dispose();

            return results;
        }

        private static IEnumerable<PostModel> SearchByMultipleFields(string searchQuery, StandardAnalyzer analyzer, int hits_limit, IndexSearcher searcher)
        {
            var parser = new MultiFieldQueryParser(Lucene.Net.Util.Version.LUCENE_30, new[] { "Id", "Title", "Discription" }, analyzer);
            var query = ParseQuery(searchQuery, parser);
            var hits = searcher.Search
            (query, null, hits_limit, Sort.RELEVANCE).ScoreDocs;
            var results = MapLuceneToDataList(hits, searcher);
            analyzer.Close();
            searcher.Dispose();

            return results;
        }

        public static IEnumerable<PostModel> SearchPosts(string input, string fieldName = "")
        {
            if (string.IsNullOrEmpty(input)) return new List<PostModel>();

            var terms = input.Trim().Replace("-", " ").Split(' ')
                .Where(x => !string.IsNullOrEmpty(x)).Select(x => x.Trim() + "*");

            input = string.Join(" ", terms);

            return Search(input, fieldName);
        }

        public static IEnumerable<PostModel> SearchDefault(string input, string fieldName = "")
        {
            return string.IsNullOrEmpty(input) ? new List<PostModel>() : Search(input, fieldName);
        }

        public static IEnumerable<PostModel> GetAllIndexRecords()
        {
            // validate search index
            if (!System.IO.Directory.EnumerateFiles(luceneDirectory).Any()) return new List<PostModel>();

            // set up lucene searcher
            var searcher = new IndexSearcher(directory, false);
            var reader = IndexReader.Open(directory, false);
            var docs = new List<Document>();
            var term = reader.TermDocs();

            while (term.Next())
                docs.Add(searcher.Doc(term.Doc));

            reader.Dispose();
            searcher.Dispose();

            return MapLuceneToDataList(docs);
        }
    }
}